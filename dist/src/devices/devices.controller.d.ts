import { DevicesService } from './devices.service';
import { Request } from 'express';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
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
    findOne(id: string): Promise<{
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
    findStatus(id: string): Promise<{
        id: string;
        updatedAt: Date;
        serialNumber: string;
        status: import("@prisma/client").$Enums.DeviceStatus;
        lastSeenAt: Date | null;
    }>;
    create(body: CreateDeviceDto): Promise<{
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
    update(id: string, body: UpdateDeviceDto): Promise<{
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
    remove(id: string): Promise<{
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
    sendCommand(serialNumber: string, body: any, req: Request & {
        user?: any;
    }): Promise<{
        success: boolean;
    }>;
}
