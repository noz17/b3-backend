import { ConfigService } from '@nestjs/config';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { DeviceLogsService } from '../device-logs/device-logs.service';
import { PrismaService } from '../database/prisma.service';
export declare class MqttService {
    private config;
    private realtimeGateway;
    private deviceLogs;
    private prisma;
    private client;
    private readonly logger;
    private connected;
    constructor(config: ConfigService, realtimeGateway: RealtimeGateway, deviceLogs: DeviceLogsService, prisma: PrismaService);
    private buildReadableLog;
    private connect;
    publishCommand(serialNumber: string, command: any): void;
    isConnected(): boolean;
}
