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
exports.DeviceLogsController = void 0;
const common_1 = require("@nestjs/common");
const device_logs_service_1 = require("./device-logs.service");
const swagger_1 = require("@nestjs/swagger");
let DeviceLogsController = class DeviceLogsController {
    logsService;
    constructor(logsService) {
        this.logsService = logsService;
    }
    async getDeviceLogs(deviceId) {
        return this.logsService.getLogsByDevice(deviceId);
    }
};
exports.DeviceLogsController = DeviceLogsController;
__decorate([
    (0, common_1.Get)(':deviceId'),
    (0, swagger_1.ApiOperation)({ summary: 'List telemetry/command logs for a particular device' }),
    (0, swagger_1.ApiParam)({ name: 'deviceId', description: 'Device identifier' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Chronological logs ordered from newest to oldest' }),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeviceLogsController.prototype, "getDeviceLogs", null);
exports.DeviceLogsController = DeviceLogsController = __decorate([
    (0, swagger_1.ApiTags)('Device Logs'),
    (0, common_1.Controller)('device-logs'),
    __metadata("design:paramtypes", [device_logs_service_1.DeviceLogsService])
], DeviceLogsController);
//# sourceMappingURL=device-logs.controller.js.map