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
var DeviceLogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let DeviceLogsService = DeviceLogsService_1 = class DeviceLogsService {
    prisma;
    config;
    logger = new common_1.Logger(DeviceLogsService_1.name);
    cleanupInterval;
    retentionDays;
    cleanupIntervalHours;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.retentionDays = Number(this.config.get('DEVICE_LOG_RETENTION_DAYS') ?? 30);
        this.cleanupIntervalHours = Number(this.config.get('DEVICE_LOG_CLEANUP_INTERVAL_HOURS') ?? 24);
    }
    onModuleInit() {
        if (this.cleanupIntervalHours > 0) {
            this.cleanupInterval = setInterval(() => this.cleanupOldLogs().catch((err) => this.logger.error(err.message)), this.cleanupIntervalHours * 60 * 60 * 1000);
        }
    }
    onModuleDestroy() {
        if (this.cleanupInterval)
            clearInterval(this.cleanupInterval);
    }
    async createLog(data) {
        try {
            const resolvedDeviceId = await this.resolveDeviceId(data.deviceId, data.deviceSerial);
            let userId = data.userId;
            if (userId) {
                const userExists = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: { id: true },
                });
                if (!userExists) {
                    this.logger.warn(`User ${userId} not found; omitting from log entry`);
                    userId = undefined;
                }
            }
            const log = await this.prisma.deviceLog.create({
                data: {
                    deviceId: resolvedDeviceId,
                    userId,
                    eventType: data.eventType,
                    command: data.command,
                    payload: data.payload,
                },
            });
            this.logger.log(`🧾 Log saved for ${data.deviceId}: ${data.eventType} (${data.command ?? ''})`);
            return log;
        }
        catch (err) {
            this.logger.error('❌ Failed to create log: ' + err.message);
            throw err;
        }
    }
    async getLogsByDevice(deviceIdOrSerial) {
        const device = await this.prisma.device.findFirst({
            where: {
                OR: [{ id: deviceIdOrSerial }, { serialNumber: deviceIdOrSerial }],
            },
            select: { id: true },
        });
        if (!device) {
            return [];
        }
        const items = await this.prisma.deviceLog.findMany({
            where: { deviceId: device.id },
            orderBy: { createdAt: 'asc' },
        });
        return items;
    }
    async cleanupOldLogs(retentionOverride) {
        const retentionDays = retentionOverride ?? this.retentionDays;
        const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
        const result = await this.prisma.deviceLog.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
        if (result.count > 0) {
            this.logger.log(`♻️ Cleaned ${result.count} logs older than ${retentionDays} days.`);
        }
        return result.count;
    }
    async resolveDeviceId(deviceId, deviceSerial) {
        if (deviceId) {
            const existing = await this.prisma.device.findUnique({
                where: { id: deviceId },
                select: { id: true },
            });
            if (existing)
                return existing.id;
        }
        const serialKey = deviceSerial ?? deviceId;
        if (!serialKey)
            throw new Error('deviceSerial or deviceId is required to create log');
        const device = await this.prisma.device.upsert({
            where: { serialNumber: serialKey },
            update: {},
            create: {
                serialNumber: serialKey,
                name: serialKey,
                status: client_1.DeviceStatus.OFFLINE,
            },
        });
        return device.id;
    }
};
exports.DeviceLogsService = DeviceLogsService;
exports.DeviceLogsService = DeviceLogsService = DeviceLogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], DeviceLogsService);
//# sourceMappingURL=device-logs.service.js.map