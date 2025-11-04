"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttConfig = void 0;
exports.mqttConfig = {
    broker: {
        url: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
        options: {
            clientId: `express_mqtt_${Math.random().toString(16).slice(3)}`,
            clean: true,
            connectTimeout: 4000,
            username: process.env.MQTT_USERNAME || '',
            password: process.env.MQTT_PASSWORD || '',
            reconnectPeriod: 1000,
        },
    },
    topics: {
        magnetState: 'sensors/current',
    },
};
//# sourceMappingURL=mqtt.js.map