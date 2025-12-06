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
var RealtimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
// src/realtime/realtime.gateway.ts
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    constructor() {
        this.logger = new common_1.Logger(RealtimeGateway_1.name);
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    broadcastDeviceStatus(deviceId, payload) {
        this.server.to(deviceId).emit('device-status', Object.assign({ deviceId }, payload));
        this.logger.debug(`Broadcasted status for device ${deviceId}`);
    }
    broadcastDeviceConnection(deviceId, status) {
        this.server.to(deviceId).emit('device-connection', { deviceId, status });
        this.logger.debug(`Broadcasted connection for device ${deviceId}: ${status}`);
    }
    broadcastDeviceLog(log) {
        this.server.to(log.deviceId).emit('device-log', log);
        this.logger.debug(`Broadcasted device log for ${log.deviceId}: ${log.type}`);
    }
    broadcastDeviceAvailability(deviceId, available) {
        this.server
            .to(deviceId)
            .emit('device-availability', { deviceId, available });
        this.logger.debug(`Broadcasted availability for device ${deviceId}: ${available ? 'AVAILABLE' : 'UNAVAILABLE'}`);
    }
    handleJoin(data, client) {
        if (!(data === null || data === void 0 ? void 0 : data.deviceId))
            return;
        client.join(data.deviceId);
        this.logger.log(`Client ${client.id} joined device room ${data.deviceId}`);
    }
    handleLeave(data, client) {
        if (!(data === null || data === void 0 ? void 0 : data.deviceId))
            return;
        client.leave(data.deviceId);
        this.logger.log(`Client ${client.id} left device room ${data.deviceId}`);
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-device'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-device'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleLeave", null);
exports.RealtimeGateway = RealtimeGateway = RealtimeGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], RealtimeGateway);
