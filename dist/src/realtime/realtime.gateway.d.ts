import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
    broadcastDeviceStatus(deviceId: string, payload: any): void;
    broadcastDeviceConnection(deviceId: string, status: string): void;
    broadcastDeviceLog(log: {
        deviceId: string;
        type: string;
        message?: string;
        payload?: any;
        userId?: string;
        createdAt?: string;
        display?: {
            displaySummary: string;
            displayDetail: string;
        };
    }): void;
    broadcastDeviceAvailability(deviceId: string, available: boolean): void;
    handleJoin(data: {
        deviceId: string;
    }, client: any): void;
    handleLeave(data: {
        deviceId: string;
    }, client: any): void;
}
