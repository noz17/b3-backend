import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LogType } from '@prisma/client';
export declare class DeviceLogsService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    private cleanupInterval?;
    private readonly retentionDays;
    private readonly cleanupIntervalHours;
    constructor(prisma: PrismaService, config: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    createLog(data: {
        deviceId?: string;
        deviceSerial?: string;
        eventType: LogType;
        command?: string;
        payload?: any;
        userId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.LogType;
        command: string | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        deviceId: string;
        userId: string | null;
    }>;
    getLogsByDevice(deviceIdOrSerial: string): Promise<{
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.LogType;
        command: string | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        deviceId: string;
        userId: string | null;
    }[]>;
    cleanupOldLogs(retentionOverride?: number): Promise<number>;
    private resolveDeviceId;
}
