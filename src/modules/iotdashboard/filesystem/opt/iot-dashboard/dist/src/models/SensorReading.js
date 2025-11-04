"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorReading = void 0;
class SensorReading {
    constructor(sensorId, data, timestamp) {
        this.sensorId = sensorId;
        this.data = data;
        this.timestamp = timestamp || new Date().toISOString();
    }
    toJSON() {
        return {
            sensorId: this.sensorId,
            data: this.data,
            timestamp: this.timestamp,
        };
    }
}
exports.SensorReading = SensorReading;
//# sourceMappingURL=SensorReading.js.map