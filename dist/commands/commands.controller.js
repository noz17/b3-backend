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
exports.CommandsController = void 0;
const common_1 = require("@nestjs/common");
const commands_service_1 = require("./commands.service");
const send_command_dto_1 = require("./dto/send-command.dto");
const swagger_1 = require("@nestjs/swagger");
let CommandsController = class CommandsController {
    constructor(commandsService) {
        this.commandsService = commandsService;
    }
    sendToDevice(id, dto) {
        return this.commandsService.sendToDevice(id, dto);
    }
    sendToGroup(id, dto) {
        return this.commandsService.sendToGroup(id, dto);
    }
};
exports.CommandsController = CommandsController;
__decorate([
    (0, common_1.Post)('/device/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Broadcast a command payload to a single device channel',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Device ID (not serial number)' }),
    (0, swagger_1.ApiBody)({ type: send_command_dto_1.SendCommandDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Command published to the device-specific topic',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_command_dto_1.SendCommandDto]),
    __metadata("design:returntype", void 0)
], CommandsController.prototype, "sendToDevice", null);
__decorate([
    (0, common_1.Post)('/group/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Publish a command payload to all devices in a group',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group identifier' }),
    (0, swagger_1.ApiBody)({ type: send_command_dto_1.SendCommandDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Command published to the group topic' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_command_dto_1.SendCommandDto]),
    __metadata("design:returntype", void 0)
], CommandsController.prototype, "sendToGroup", null);
exports.CommandsController = CommandsController = __decorate([
    (0, swagger_1.ApiTags)('Commands'),
    (0, common_1.Controller)('commands'),
    __metadata("design:paramtypes", [commands_service_1.CommandsService])
], CommandsController);
