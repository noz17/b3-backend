import { DeviceStatus } from '@prisma/client';
export declare class CreateDeviceDto {
    serialNumber: string;
    name: string;
    description?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    status?: DeviceStatus;
}
