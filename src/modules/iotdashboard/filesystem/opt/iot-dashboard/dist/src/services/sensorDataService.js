"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensorDataService = exports.SensorDataService = void 0;
const events_1 = require("events");
const SensorReading_1 = require("../models/SensorReading");
const emailService_1 = require("./emailService");
const email_config_1 = require("../../config/email-config");
const constants_1 = require("../../config/constants");
class SensorDataService extends events_1.EventEmitter {
    constructor() {
        super();
        this.latestData = new Map();
        this.dataHistory = [];
        this.maxHistorySize = 1000;
        this.emailService = new emailService_1.EmailService(email_config_1.emailConfig);
        this.lastEmailSentAt = null;
    }
    async addReading(sensorId, data) {
        const reading = new SensorReading_1.SensorReading(sensorId, data);
        // Store latest data
        this.latestData.set(sensorId, reading);
        // Add to history
        this.dataHistory.push(reading);
        // Limit history size
        if (this.dataHistory.length > this.maxHistorySize) {
            this.dataHistory.shift();
        }
        // Emit event for real-time updates
        this.emit('newReading', reading);
        await this.validateSensorReading(data);
        return reading;
    }
    getLatestReading(sensorId) {
        return this.latestData.get(sensorId);
    }
    async getAllLatestReadings() {
        let result = {};
        this.latestData.forEach((value) => {
            result = value;
        });
        return result;
    }
    async validateSensorReading(data) {
        const anomalyData = {
            metrics: [],
            overallSeverity: 'CRITICAL', // Worst case from all metrics
            timestamp: new Date().toISOString(),
            details: 'Optional additional context',
        };
        const now = new Date();
        const canSendEmail = !this.lastEmailSentAt || now.getTime() - this.lastEmailSentAt.getTime() >= 30 * 60 * 1000;
        let anomaly = false;
        console.log('Last Email sent at:', this.lastEmailSentAt);
        if (canSendEmail) {
            for (const [metric, value] of Object.entries(data)) {
                if (constants_1.METRIC_RULES[metric]) {
                    const rule = constants_1.METRIC_RULES[metric];
                    if (Math.abs(rule.stableValue - parseFloat(value)) >= rule.threshold) {
                        anomaly = true;
                        anomalyData.metrics.push({
                            name: metric,
                            value: value,
                            stableValue: rule.stableValue.toString(),
                            status: 'CRITICAL',
                        });
                    }
                }
                else {
                    anomalyData.metrics.push({
                        name: metric,
                        value: value,
                        stableValue: '-',
                        status: 'OK',
                    });
                }
            }
            if (anomaly) {
                console.log('Config: ', JSON.stringify(email_config_1.emailConfig));
                await this.emailService.sendAnomalyAlert(anomalyData);
                this.lastEmailSentAt = now;
            }
        }
    }
    getHistory(sensorId, limit = 100) {
        if (sensorId) {
            return this.dataHistory.filter((reading) => reading.sensorId === sensorId).slice(-limit);
        }
        return this.dataHistory.slice(-limit);
    }
    getReadingsByTimeRange(sensorId, startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        return this.dataHistory.filter((reading) => {
            const timestamp = new Date(reading.timestamp);
            const matchesSensor = sensorId ? reading.sensorId === sensorId : true;
            return matchesSensor && timestamp >= start && timestamp <= end;
        });
    }
    clearHistory(sensorId) {
        if (sensorId) {
            this.dataHistory = this.dataHistory.filter((reading) => reading.sensorId !== sensorId);
            this.latestData.delete(sensorId);
        }
        else {
            this.dataHistory = [];
            this.latestData.clear();
        }
    }
    getStats(sensorId) {
        const readings = sensorId
            ? this.dataHistory.filter((r) => r.sensorId === sensorId)
            : this.dataHistory;
        return {
            totalReadings: readings.length,
            firstReading: readings[0]?.timestamp || null,
            lastReading: readings[readings.length - 1]?.timestamp || null,
            sensors: Array.from(this.latestData.keys()),
        };
    }
}
exports.SensorDataService = SensorDataService;
// Singleton instance
exports.sensorDataService = new SensorDataService();
//# sourceMappingURL=sensorDataService.js.map