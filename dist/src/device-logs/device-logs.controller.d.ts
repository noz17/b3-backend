import { DeviceLogsService } from './device-logs.service';
export declare class DeviceLogsController {
    private readonly logsService;
    constructor(logsService: DeviceLogsService);
    getDeviceLogs(deviceId: string): Promise<{
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.LogType;
        command: string | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        deviceId: string;
        userId: string | null;
    }[]>;
}
