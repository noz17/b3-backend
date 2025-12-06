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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
const groups_service_1 = require("./groups.service");
const create_group_dto_1 = require("./dto/create-group.dto");
const update_group_dto_1 = require("./dto/update-group.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let GroupsController = class GroupsController {
    groupsService;
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    create(data) {
        return this.groupsService.create(data);
    }
    findAll() {
        return this.groupsService.findAll();
    }
    findOne(id) {
        return this.groupsService.findOne(id);
    }
    update(id, data) {
        return this.groupsService.update(id, data);
    }
    remove(id) {
        return this.groupsService.remove(id);
    }
    addDevice(groupId, deviceId) {
        return this.groupsService.addDevice(groupId, deviceId);
    }
    removeDevice(groupId, deviceId) {
        return this.groupsService.removeDevice(groupId, deviceId);
    }
    listDevices(groupId) {
        return this.groupsService.listDevices(groupId);
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiOperation)({ summary: 'Create a device group' }),
    (0, swagger_1.ApiBody)({ type: create_group_dto_1.CreateGroupDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Newly created group payload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all groups' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Array of groups from database' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get group details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group identifier' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Group data' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiOperation)({ summary: 'Update group information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group identifier' }),
    (0, swagger_1.ApiBody)({ type: update_group_dto_1.UpdateGroupDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Updated group data' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_group_dto_1.UpdateGroupDto]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group identifier' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Deletion acknowledgement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/devices/:deviceId'),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Attach a device to a group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group identifier' }),
    (0, swagger_1.ApiParam)({ name: 'deviceId', description: 'Device ID (use database id, not serial)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Result of the association' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "addDevice", null);
__decorate([
    (0, common_1.Delete)(':id/devices/:deviceId'),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Detach a device from a group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group identifier' }),
    (0, swagger_1.ApiParam)({ name: 'deviceId', description: 'Device ID (use database id, not serial)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Result of the disassociation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "removeDevice", null);
__decorate([
    (0, common_1.Get)(':id/devices'),
    (0, swagger_1.ApiOperation)({ summary: 'List device-group membership rows for a group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group identifier' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Array of pivot records including device details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "listDevices", null);
exports.GroupsController = GroupsController = __decorate([
    (0, swagger_1.ApiTags)('Groups'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [groups_service_1.GroupsService])
], GroupsController);
//# sourceMappingURL=groups.controller.js.map