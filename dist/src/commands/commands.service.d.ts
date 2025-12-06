import { PrismaService } from '../database/prisma.service';
import { MqttService } from '../mqtt/mqtt.service';
import { GroupsService } from '../groups/groups.service';
export declare class CommandsService {
    private prisma;
    private mqtt;
    private groups;
    private readonly logger;
    constructor(prisma: PrismaService, mqtt: MqttService, groups: GroupsService);
    sendToDevice(deviceId: string, payload: any): Promise<void>;
    sendToGroup(groupId: string, payload: any): Promise<{
        success: boolean;
        count: number;
    }>;
}
