"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttService = exports.MQTTService = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const events_1 = require("events");
const mqtt_2 = require("../../config/mqtt");
class MQTTService extends events_1.EventEmitter {
    constructor() {
        super();
        this.client = null;
        this.isConnected = false;
    }
    connect() {
        if (this.client) {
            return this.client;
        }
        this.client = mqtt_1.default.connect(mqtt_2.mqttConfig.broker.url, mqtt_2.mqttConfig.broker.options);
        this.client.on('connect', () => {
            console.log('✓ MQTT Connected');
            this.isConnected = true;
            this.emit('connected');
            this.subscribeToTopics();
        });
        this.client.on('error', (error) => {
            console.error('✗ MQTT Error:', error);
            this.emit('error', error);
        });
        this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message);
        });
        this.client.on('close', () => {
            console.log('✗ MQTT Disconnected');
            this.isConnected = false;
            this.emit('disconnected');
        });
        return this.client;
    }
    subscribeToTopics() {
        if (!this.client)
            return;
        const topics = Object.values(mqtt_2.mqttConfig.topics);
        this.client.subscribe(topics, (err) => {
            if (err) {
                console.error('✗ Subscription error:', err);
            }
            else {
                console.log('✓ Subscribed to topics:', topics);
            }
        });
    }
    handleMessage(topic, message) {
        try {
            const data = JSON.parse(message.toString());
            // Emit events based on topic
            if (topic === mqtt_2.mqttConfig.topics.magnetState) {
                this.emit('magnetState', data);
            }
            // Emit generic message event
            this.emit('message', { topic, data });
        }
        catch (error) {
            console.error('Error parsing MQTT message:', error);
            this.emit('parseError', {
                topic,
                message: message.toString(),
                error: error,
            });
        }
    }
    publish(topic, data) {
        if (!this.isConnected || !this.client) {
            console.warn('Cannot publish: MQTT not connected');
            return false;
        }
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        this.client.publish(topic, payload, (err) => {
            if (err) {
                console.error('Publish error:', err);
            }
        });
        return true;
    }
    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.isConnected = false;
        }
    }
}
exports.MQTTService = MQTTService;
// Singleton instance
exports.mqttService = new MQTTService();
//# sourceMappingURL=mqttService.js.map