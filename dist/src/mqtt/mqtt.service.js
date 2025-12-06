"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MqttService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt_1 = require("mqtt");
const config_1 = require("@nestjs/config");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const device_logs_service_1 = require("../device-logs/device-logs.service");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let MqttService = MqttService_1 = class MqttService {
    config;
    realtimeGateway;
    deviceLogs;
    prisma;
    client;
    logger = new common_1.Logger(MqttService_1.name);
    connected = false;
    constructor(config, realtimeGateway, deviceLogs, prisma) {
        this.config = config;
        this.realtimeGateway = realtimeGateway;
        this.deviceLogs = deviceLogs;
        this.prisma = prisma;
        this.connect();
    }
    buildReadableLog(type, message, payload) {
        const makeDetailString = (data) => Object.entries(data)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' · ');
        if (type === 'STATUS' && payload && typeof payload === 'object') {
            const relay = payload.relay_state ?? payload.relay ?? payload.relayState;
            const detail = makeDetailString({
                last_seen: payload.last_seen ?? payload.lastSeen,
                relay_state: relay,
                serial_number: payload.serial_number ?? payload.serialNumber,
                device_connection: payload.device_connection ?? payload.connection ?? payload.status,
            });
            const summaryParts = ['STATUS', message, relay ? `relay=${relay}` : undefined].filter(Boolean);
            return {
                displaySummary: summaryParts.join(' · '),
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
            displayDetail: typeof payload === 'object' ? makeDetailString(payload) : String(payload ?? ''),
        };
    }
    connect() {
        const rawUrl = this.config.get('MQTT_URL');
        if (!rawUrl)
            throw new Error('MQTT_URL not set in environment');
        const mqttUrl = rawUrl.startsWith('mqtt://') || rawUrl.startsWith('ws://') || rawUrl.startsWith('wss://')
            ? rawUrl
            : `mqtt://${rawUrl}`;
        this.logger.log(`Connecting to MQTT: ${mqttUrl}`);
        this.client = (0, mqtt_1.connect)(mqttUrl);
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
        this.client.on('message', async (topic, payload) => {
            const parts = topic.split('/');
            const deviceId = parts[1];
            const event = parts[2];
            if (event === 'status') {
                const raw = payload.toString();
                let parsed = raw;
                try {
                    parsed = JSON.parse(raw);
                }
                catch {
                    this.logger.warn(`Status payload not JSON for ${deviceId}, storing raw text`);
                }
                const statusPayload = typeof parsed === 'object' ? parsed : { message: parsed };
                const readable = this.buildReadableLog('STATUS', 'Status update received', parsed);
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
                    eventType: client_1.LogType.STATUS,
                    command: 'Status update received',
                    payload: parsed,
                });
            }
            else if (event === 'lwt') {
                const status = payload.toString().trim();
                this.logger.log(`LWT received for device ${deviceId}: ${status}`);
                this.realtimeGateway.broadcastDeviceConnection(deviceId, status);
                this.realtimeGateway.broadcastDeviceAvailability(deviceId, status.toUpperCase() !== 'OFFLINE');
                this.realtimeGateway.broadcastDeviceStatus(deviceId, { status });
                const readable = this.buildReadableLog('LWT', `Device connection ${status}`, status);
                this.realtimeGateway.broadcastDeviceLog({
                    deviceId,
                    type: 'LWT',
                    message: readable.displaySummary,
                    payload: status,
                    display: readable,
                    createdAt: new Date().toISOString(),
                });
                await this.deviceLogs.createLog({
                    deviceSerial: deviceId,
                    eventType: status.toUpperCase() === 'OFFLINE' ? client_1.LogType.ERROR : client_1.LogType.SYSTEM,
                    command: 'LWT',
                    payload: status,
                });
                const normalized = status.toUpperCase() === 'ONLINE' ? client_1.DeviceStatus.ONLINE : client_1.DeviceStatus.OFFLINE;
                await this.prisma.device.upsert({
                    where: { serialNumber: deviceId },
                    update: { status: normalized, lastSeenAt: new Date() },
                    create: {
                        serialNumber: deviceId,
                        name: deviceId,
                        status: normalized,
                        lastSeenAt: new Date(),
                    },
                });
            }
        });
    }
    publishCommand(serialNumber, command) {
        const topic = `device/${serialNumber}/cmd`;
        const payload = typeof command === 'string' || Buffer.isBuffer(command)
            ? command
            : JSON.stringify(command);
        this.client.publish(topic, payload);
        this.logger.log(`Published to ${topic}`);
    }
    isConnected() {
        return this.connected;
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = MqttService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        realtime_gateway_1.RealtimeGateway,
        device_logs_service_1.DeviceLogsService,
        prisma_service_1.PrismaService])
], MqttService);
//# sourceMappingURL=mqtt.service.js.map