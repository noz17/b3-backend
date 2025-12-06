import { Injectable, Logger } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { DeviceLogsService } from '../device-logs/device-logs.service';
import { DeviceStatus, LogType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MqttService {
  private client: MqttClient;
  private readonly logger = new Logger(MqttService.name);
  private connected = false;

  constructor(
    private config: ConfigService,
    private realtimeGateway: RealtimeGateway,
    private deviceLogs: DeviceLogsService,
    private prisma: PrismaService,
  ) {
    this.connect();
  }

  // Build readable text for frontend
  private buildReadableLog(type: string, message: string, payload: any) {
    const makeDetailString = (data: Record<string, any>) =>
      Object.entries(data)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · ');

    if (type === 'STATUS' && payload && typeof payload === 'object') {
      const relay = payload.relay_state ?? payload.relay ?? payload.relayState;

      const detail = makeDetailString({
        last_seen: payload.last_seen ?? payload.lastSeen,
        relay_state: relay,
        serial_number: payload.serial_number ?? payload.serialNumber,
        device_connection:
          payload.device_connection ?? payload.connection ?? payload.status,
      });

      return {
        displaySummary: `STATUS · ${message} · ${relay ? `relay=${relay}` : ''}`,
        displayDetail: detail,
      };
    }

    if (type === 'LWT') {
      return {
        displaySummary: `LWT · ${message}`,
        displayDetail: `device_connection: ${payload ?? ''}`,
      };
    }

    return {
      displaySummary: `${type} · ${message}`,
      displayDetail:
        typeof payload === 'object'
          ? makeDetailString(payload)
          : String(payload ?? ''),
    };
  }

  private connect() {
    const rawUrl = this.config.get<string>('MQTT_URL');
    if (!rawUrl) throw new Error('MQTT_URL not set in environment');

    const mqttUrl =
      rawUrl.startsWith('mqtt://') ||
      rawUrl.startsWith('ws://') ||
      rawUrl.startsWith('wss://')
        ? rawUrl
        : `mqtt://${rawUrl}`;

    this.logger.log(`Connecting to MQTT: ${mqttUrl}`);
    this.client = connect(mqttUrl);

    this.client.on('connect', () => {
      this.connected = true;
      this.logger.log(`Connected to MQTT: ${mqttUrl}`);
      this.client.subscribe('device/+/status');
      this.client.subscribe('device/+/lwt');
    });

    this.client.on('reconnect', () => {
      this.logger.warn('Reconnecting to MQTT broker...');
    });

    this.client.on('close', () => {
      this.connected = false;
      this.logger.warn('MQTT connection closed');
    });

    this.client.on('error', (err) => {
      this.connected = false;
      this.logger.error(`MQTT error: ${err.message}`);
    });

    // ============================
    //    MAIN MESSAGE HANDLER
    // ============================
    this.client.on('message', async (topic, payload) => {
      const [_, deviceId, event] = topic.split('/');

      // ========================
      //        STATUS
      // ========================
      if (event === 'status') {
        const raw = payload.toString();
        let parsed: any = raw;

        try {
          parsed = JSON.parse(raw);
        } catch {
          this.logger.warn(
            `Status payload not JSON for ${deviceId}, storing raw text`,
          );
        }

        const statusPayload =
          typeof parsed === 'object' ? parsed : { message: parsed };

        const readable = this.buildReadableLog(
          'STATUS',
          'Status update received',
          parsed,
        );

        this.realtimeGateway.broadcastDeviceStatus(deviceId, statusPayload);

        this.realtimeGateway.broadcastDeviceLog({
          deviceId,
          type: 'STATUS',
          message: readable.displaySummary,
          payload: parsed,
          display: readable,
          createdAt: new Date().toISOString(),
        });

        await this.deviceLogs.createLog({
          deviceSerial: deviceId,
          eventType: LogType.STATUS,
          command: 'Status update received',
          payload: parsed,
        });
        return;
      }

      // ========================
      //          LWT
      // ========================
      if (event === 'lwt') {
        const status = payload.toString().trim();
        const normalized =
          status.toUpperCase() === 'ONLINE'
            ? DeviceStatus.ONLINE
            : DeviceStatus.OFFLINE;

        const now = new Date();

        this.logger.log(`LWT received for device ${deviceId}: ${status}`);

        // --- Broadcast realtime updates ---
        this.realtimeGateway.broadcastDeviceConnection(deviceId, status);
        this.realtimeGateway.broadcastDeviceAvailability(
          deviceId,
          normalized === DeviceStatus.ONLINE,
        );
        this.realtimeGateway.broadcastDeviceStatus(deviceId, { status });

        const readable = this.buildReadableLog(
          'LWT',
          `Device connection ${status}`,
          status,
        );

        this.realtimeGateway.broadcastDeviceLog({
          deviceId,
          type: 'LWT',
          message: readable.displaySummary,
          payload: status,
          display: readable,
          createdAt: now.toISOString(),
        });

        // --- Save log ---
        await this.deviceLogs.createLog({
          deviceSerial: deviceId,
          eventType:
            normalized === DeviceStatus.ONLINE
              ? LogType.SYSTEM
              : LogType.ERROR,
          command: 'LWT',
          payload: status,
        });

        // ==========================================
        //   SAFE DEVICE UPDATE (NO MORE P2002 ERROR)
        // ==========================================
        try {
          await this.prisma.device.update({
            where: { serialNumber: deviceId },
            data: {
              status: normalized,
              lastSeenAt: now,
            },
          });
        } catch (err) {
          if (err.code === 'P2025') {
            // Device not found → try create
            try {
              await this.prisma.device.create({
                data: {
                  serialNumber: deviceId,
                  name: deviceId,
                  status: normalized,
                  lastSeenAt: now,
                },
              });
            } catch (createErr) {
              // If someone else created at the same time → recover
              if (createErr.code === 'P2002') {
                await this.prisma.device.update({
                  where: { serialNumber: deviceId },
                  data: { status: normalized, lastSeenAt: now },
                });
              } else {
                throw createErr;
              }
            }
          } else {
            throw err;
          }
        }
      }
    });
  }

  publishCommand(serialNumber: string, command: any) {
    const topic = `device/${serialNumber}/cmd`;
    const payload =
      typeof command === 'string' || Buffer.isBuffer(command)
        ? command
        : JSON.stringify(command);

    this.client.publish(topic, payload);
    this.logger.log(`Published to ${topic}`);
  }

  isConnected() {
    return this.connected;
  }
}
