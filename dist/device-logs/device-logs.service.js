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
    constructor(prisma, config) {
        var _a, _b;
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(DeviceLogsService_1.name);
        this.retentionDays = Number((_a = this.config.get('DEVICE_LOG_RETENTION_DAYS')) !== null && _a !== void 0 ? _a : 30);
        this.cleanupIntervalHours = Number((_b = this.config.get('DEVICE_LOG_CLEANUP_INTERVAL_HOURS')) !== null && _b !== void 0 ? _b : 24);
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
        var _a;
        try {
            const resolvedDeviceId = await this.resolveDeviceId(data.deviceId, data.deviceSerial);
            const log = await this.prisma.deviceLog.create({
                data: {
                    deviceId: resolvedDeviceId,
                    userId: data.userId,
                    eventType: data.eventType,
                    command: data.command,
                    payload: data.payload,
                },
            });
            this.logger.log(`🧾 Log saved for ${(_a = data.deviceSerial) !== null && _a !== void 0 ? _a : data.deviceId}: ${data.eventType}`);
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
        if (!device)
            return [];
        return this.prisma.deviceLog.findMany({
            where: { deviceId: device.id },
            orderBy: { createdAt: 'asc' },
        });
    }
    async cleanupOldLogs(retentionOverride) {
        const retentionDays = retentionOverride !== null && retentionOverride !== void 0 ? retentionOverride : this.retentionDays;
        const cutoff = new Date(Date.now() - retentionDays * 86400000);
        const result = await this.prisma.deviceLog.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
        if (result.count > 0) {
            this.logger.log(`♻️ Cleaned ${result.count} logs older than ${retentionDays} days.`);
        }
        return result.count;
    }
    // === FIXED FUNCTION (ANTI-P2002) ===
    async resolveDeviceId(deviceId, deviceSerial) {
        if (deviceId) {
            const existing = await this.prisma.device.findUnique({
                where: { id: deviceId },
                select: { id: true },
            });
            if (existing)
                return existing.id;
        }
        const serialKey = deviceSerial !== null && deviceSerial !== void 0 ? deviceSerial : deviceId;
        if (!serialKey)
            throw new Error('deviceSerial or deviceId is required to create log');
        const existingDevice = await this.prisma.device.findUnique({
            where: { serialNumber: serialKey },
            select: { id: true },
        });
        if (existingDevice)
            return existingDevice.id;
        try {
            const created = await this.prisma.device.create({
                data: {
                    serialNumber: serialKey,
                    name: serialKey,
                    status: client_1.DeviceStatus.OFFLINE,
                },
                select: { id: true },
            });
            return created.id;
        }
        catch (err) {
            if (err.code === 'P2002') {
                const retry = await this.prisma.device.findUnique({
                    where: { serialNumber: serialKey },
                    select: { id: true },
                });
                if (retry)
                    return retry.id;
            }
            throw err;
        }
    }
};
exports.DeviceLogsService = DeviceLogsService;
exports.DeviceLogsService = DeviceLogsService = DeviceLogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], DeviceLogsService);
