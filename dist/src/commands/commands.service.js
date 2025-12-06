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
var CommandsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const groups_service_1 = require("../groups/groups.service");
let CommandsService = CommandsService_1 = class CommandsService {
    prisma;
    mqtt;
    groups;
    logger = new common_1.Logger(CommandsService_1.name);
    constructor(prisma, mqtt, groups) {
        this.prisma = prisma;
        this.mqtt = mqtt;
        this.groups = groups;
    }
    async sendToDevice(deviceId, payload) {
        const device = await this.prisma.device.findUnique({
            where: { id: deviceId },
            select: { id: true, serialNumber: true },
        });
        if (!device) {
            throw new common_1.NotFoundException(`Device with id ${deviceId} not found`);
        }
        await this.prisma.deviceCommand.create({
            data: {
                commandId: `cmd_${Date.now()}`,
                type: 'device',
                payload,
                targetType: 'device',
                target: device.id,
                status: 'SENT',
            },
        });
        this.mqtt.publishCommand(device.serialNumber, payload);
        this.logger.log(`Sent command to ${device.id}`);
    }
    async sendToGroup(groupId, payload) {
        const members = await this.groups.listDevices(groupId);
        for (const member of members) {
            await this.sendToDevice(member.deviceId, payload);
        }
        return { success: true, count: members.length };
    }
};
exports.CommandsService = CommandsService;
exports.CommandsService = CommandsService = CommandsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mqtt_service_1.MqttService,
        groups_service_1.GroupsService])
], CommandsService);
//# sourceMappingURL=commands.service.js.map