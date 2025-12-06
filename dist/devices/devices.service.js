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
var DevicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const device_logs_service_1 = require("../device-logs/device-logs.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const client_1 = require("@prisma/client");
let DevicesService = DevicesService_1 = class DevicesService {
    constructor(prisma, mqtt, deviceLogs, realtimeGateway) {
        this.prisma = prisma;
        this.mqtt = mqtt;
        this.deviceLogs = deviceLogs;
        this.realtimeGateway = realtimeGateway;
        this.logger = new common_1.Logger(DevicesService_1.name);
    }
    async findAll() {
        return this.prisma.device.findMany();
    }
    async findOne(identifier) {
        return this.prisma.device.findFirst({
            where: { OR: [{ id: identifier }, { serialNumber: identifier }] },
        });
    }
    async getStatus(identifier) {
        const device = await this.prisma.device.findFirst({
            where: { OR: [{ id: identifier }, { serialNumber: identifier }] },
            select: {
                id: true,
                serialNumber: true,
                status: true,
                lastSeenAt: true,
                updatedAt: true,
            },
        });
        if (!device) {
            throw new common_1.NotFoundException(`Device ${identifier} not found`);
        }
        return device;
    }
    async create(data) {
        return this.prisma.device.create({ data });
    }
    async update(id, data) {
        return this.prisma.device.update({
            where: { id },
            data,
        });
    }
    async remove(identifier) {
        const device = await this.prisma.device.findFirst({
            where: { OR: [{ id: identifier }, { serialNumber: identifier }] },
            select: { id: true },
        });
        if (!device) {
            throw new common_1.NotFoundException(`Device ${identifier} not found`);
        }
        return this.prisma.device.delete({
            where: { id: device.id },
        });
    }
    async sendCommand(serialNumber, payload, userId) {
        var _a;
        const device = await this.prisma.device.findUnique({
            where: { serialNumber },
        });
        if (!device) {
            throw new common_1.NotFoundException(`Device ${serialNumber} not found`);
        }
        this.logger.log(`sendCommand request for ${serialNumber} by ${userId !== null && userId !== void 0 ? userId : 'unknown user'}`);
        await this.mqtt.publishCommand(serialNumber, payload);
        const commandLabel = typeof payload === 'string' ? payload : ((_a = payload === null || payload === void 0 ? void 0 : payload.command) !== null && _a !== void 0 ? _a : 'CUSTOM');
        await this.deviceLogs.createLog({
            deviceId: device.id,
            userId,
            eventType: client_1.LogType.COMMAND,
            command: commandLabel,
            payload,
        });
        // Emit websocket log
        this.realtimeGateway.broadcastDeviceLog({
            deviceId: serialNumber,
            type: 'COMMAND',
            message: `Command sent by ${userId !== null && userId !== void 0 ? userId : 'unknown'}`,
            payload,
            userId,
            createdAt: new Date().toISOString(),
        });
        return { success: true };
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = DevicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mqtt_service_1.MqttService,
        device_logs_service_1.DeviceLogsService,
        realtime_gateway_1.RealtimeGateway])
], DevicesService);
