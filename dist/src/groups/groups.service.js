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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let GroupsService = class GroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.group.create({ data });
    }
    async findAll() {
        return this.prisma.group.findMany({
            include: { memberships: { include: { device: true } } },
        });
    }
    async findOne(id) {
        return this.prisma.group.findUnique({
            where: { id },
            include: { memberships: { include: { device: true } } },
        });
    }
    async update(id, data) {
        return this.prisma.group.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.group.delete({ where: { id } });
    }
    async addDevice(groupId, deviceId) {
        const [group, device] = await Promise.all([
            this.prisma.group.findUnique({ where: { id: groupId }, select: { id: true } }),
            this.prisma.device.findUnique({ where: { id: deviceId }, select: { id: true } }),
        ]);
        if (!group) {
            throw new common_1.NotFoundException(`Group with id ${groupId} not found`);
        }
        if (!device) {
            throw new common_1.NotFoundException(`Device with id ${deviceId} not found`);
        }
        const existingMembership = await this.prisma.deviceGroupMembership.findUnique({
            where: { deviceId_groupId: { deviceId: device.id, groupId: group.id } },
        });
        if (existingMembership) {
            throw new common_1.ConflictException('Device already attached to this group');
        }
        return this.prisma.deviceGroupMembership.create({
            data: { groupId: group.id, deviceId: device.id },
        });
    }
    async removeDevice(groupId, deviceId) {
        const [group, device] = await Promise.all([
            this.prisma.group.findUnique({ where: { id: groupId }, select: { id: true } }),
            this.prisma.device.findUnique({ where: { id: deviceId }, select: { id: true } }),
        ]);
        if (!group) {
            throw new common_1.NotFoundException(`Group with id ${groupId} not found`);
        }
        if (!device) {
            throw new common_1.NotFoundException(`Device with id ${deviceId} not found`);
        }
        const deleted = await this.prisma.deviceGroupMembership.deleteMany({
            where: { groupId: group.id, deviceId: device.id },
        });
        if (!deleted.count) {
            throw new common_1.NotFoundException('Device is not attached to this group');
        }
        return deleted;
    }
    async listDevices(groupId) {
        const group = await this.prisma.group.findUnique({ where: { id: groupId }, select: { id: true } });
        if (!group) {
            throw new common_1.NotFoundException(`Group with id ${groupId} not found`);
        }
        return this.prisma.deviceGroupMembership.findMany({
            where: { groupId: group.id },
            select: {
                id: true,
                groupId: true,
                deviceId: true,
                createdAt: true,
                device: {
                    select: {
                        id: true,
                        serialNumber: true,
                        name: true,
                        description: true,
                        location: true,
                        status: true,
                        latitude: true,
                        longitude: true,
                        lastSeenAt: true,
                    },
                },
            },
        });
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map