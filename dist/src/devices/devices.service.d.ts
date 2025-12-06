import { PrismaService } from '../database/prisma.service';
import { MqttService } from '../mqtt/mqtt.service';
import { DeviceLogsService } from '../device-logs/device-logs.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';
export declare class DevicesService {
    private prisma;
    private mqtt;
    private deviceLogs;
    private realtimeGateway;
    private readonly logger;
    constructor(prisma: PrismaService, mqtt: MqttService, deviceLogs: DeviceLogsService, realtimeGateway: RealtimeGateway);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        description: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.DeviceStatus;
        lastSeenAt: Date | null;
    }[]>;
    findOne(identifier: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        description: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.DeviceStatus;
        lastSeenAt: Date | null;
    } | null>;
    getStatus(identifier: string): Promise<{
        id: string;
        updatedAt: Date;
        serialNumber: string;
        status: import("@prisma/client").$Enums.DeviceStatus;
        lastSeenAt: Date | null;
    }>;
    create(data: CreateDeviceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        description: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.DeviceStatus;
        lastSeenAt: Date | null;
    }>;
    update(id: string, data: UpdateDeviceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        description: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.DeviceStatus;
        lastSeenAt: Date | null;
    }>;
    remove(identifier: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        description: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.DeviceStatus;
        lastSeenAt: Date | null;
    }>;
    sendCommand(serialNumber: string, payload: any, userId?: string): Promise<{
        success: boolean;
    }>;
}
