import { MqttClient } from 'mqtt';
import { EventEmitter } from 'events';
import { MagnetState } from '../types';
interface MQTTServiceEvents {
    connected: () => void;
    disconnected: () => void;
    error: (error: Error) => void;
    message: (payload: {
        topic: string;
        data: any;
    }) => void;
    magnetState: (data: MagnetState) => void;
    parseError: (payload: {
        topic: string;
        message: string;
        error: Error;
    }) => void;
}
export declare interface MQTTService {
    on<K extends keyof MQTTServiceEvents>(event: K, listener: MQTTServiceEvents[K]): this;
    emit<K extends keyof MQTTServiceEvents>(event: K, ...args: Parameters<MQTTServiceEvents[K]>): boolean;
}
export declare class MQTTService extends EventEmitter {
    private client;
    isConnected: boolean;
    constructor();
    connect(): MqttClient;
    private subscribeToTopics;
    private handleMessage;
    publish(topic: string, data: string | object): boolean;
    disconnect(): void;
}
export declare const mqttService: MQTTService;
export {};
//# sourceMappingURL=mqttService.d.ts.map