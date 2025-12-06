import { PrismaService } from '../database/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateGroupDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<({
        memberships: ({
            device: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            deviceId: string;
            groupId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: string): Promise<({
        memberships: ({
            device: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            deviceId: string;
            groupId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }) | null>;
    update(id: string, data: UpdateGroupDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    addDevice(groupId: string, deviceId: string): Promise<{
        id: string;
        createdAt: Date;
        deviceId: string;
        groupId: string;
    }>;
    removeDevice(groupId: string, deviceId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    listDevices(groupId: string): Promise<{
        id: string;
        createdAt: Date;
        device: {
            id: string;
            name: string;
            serialNumber: string;
            description: string | null;
            location: string | null;
            latitude: number | null;
            longitude: number | null;
            status: import("@prisma/client").$Enums.DeviceStatus;
            lastSeenAt: Date | null;
        };
        deviceId: string;
        groupId: string;
    }[]>;
}
