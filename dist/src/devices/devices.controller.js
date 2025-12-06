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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const devices_service_1 = require("./devices.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
const client_1 = require("@prisma/client");
const create_device_dto_1 = require("./dto/create-device.dto");
const update_device_dto_1 = require("./dto/update-device.dto");
const swagger_1 = require("@nestjs/swagger");
let DevicesController = class DevicesController {
    devicesService;
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    findAll() {
        return this.devicesService.findAll();
    }
    findOne(id) {
        return this.devicesService.findOne(id);
    }
    findStatus(id) {
        return this.devicesService.getStatus(id);
    }
    create(body) {
        return this.devicesService.create(body);
    }
    update(id, body) {
        return this.devicesService.update(id, body);
    }
    remove(id) {
        return this.devicesService.remove(id);
    }
    sendCommand(serialNumber, body, req) {
        let payload = body;
        if (body && typeof body === 'object') {
            if ('payload' in body) {
                const inner = body.payload;
                payload = inner && typeof inner === 'object' && typeof inner.command === 'string' ? inner.command : inner;
            }
            else if ('command' in body && typeof body.command === 'string') {
                payload = body.command;
            }
        }
        return this.devicesService.sendCommand(serialNumber, payload, req.user?.sub);
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered devices' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Array of devices returned from the database' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single device by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Device identifier from database' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Device data when found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve last known connectivity status of a device' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Device identifier from database' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Status value based on logs or MQTT presence' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "findStatus", null);
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new device' }),
    (0, swagger_1.ApiBody)({ type: create_device_dto_1.CreateDeviceDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Device successfully created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_device_dto_1.CreateDeviceDto]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiOperation)({ summary: 'Update device information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Device identifier from database' }),
    (0, swagger_1.ApiBody)({ type: update_device_dto_1.UpdateDeviceDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Updated device payload' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_device_dto_1.UpdateDeviceDto]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a device permanently' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Device identifier from database' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Deletion acknowledgement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':serialNumber/cmd'),
    (0, auth_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Relay a command to a device topic' }),
    (0, swagger_1.ApiParam)({ name: 'serialNumber', description: 'Hardware serial number used as MQTT topic suffix' }),
    (0, swagger_1.ApiBody)({
        description: 'Provide either { payload }, { command }, or a raw string body to be sent to MQTT',
        schema: {
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        payload: { type: 'object', additionalProperties: true },
                    },
                },
                {
                    type: 'object',
                    properties: {
                        command: { type: 'string' },
                    },
                },
                { type: 'string' },
            ],
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Command queued to MQTT broker' }),
    __param(0, (0, common_1.Param)('serialNumber')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "sendCommand", null);
exports.DevicesController = DevicesController = __decorate([
    (0, swagger_1.ApiTags)('Devices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('devices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map