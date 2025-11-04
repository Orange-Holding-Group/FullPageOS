"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensorController = void 0;
const sensorDataService_1 = require("../services/sensorDataService");
const mqttService_1 = require("../services/mqttService");
const mqtt_1 = require("../../config/mqtt");
class SensorController {
    // Get latest reading for a specific sensor
    getLatestReading(req, res, next) {
        try {
            const { sensorId } = req.params;
            const reading = sensorDataService_1.sensorDataService.getLatestReading(sensorId);
            if (!reading) {
                res.status(404).json({
                    success: false,
                    message: `No data found for sensor: ${sensorId}`,
                });
                return;
            }
            res.json({
                success: true,
                data: reading,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all latest readings
    async getAllLatestReadings(_req, res, next) {
        try {
            const readings = await sensorDataService_1.sensorDataService.getAllLatestReadings();
            res.json({
                success: true,
                data: readings,
                count: Object.keys(readings).length,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get historical data
    getHistory(req, res, next) {
        try {
            const { sensorId } = req.params;
            const limit = parseInt(req.query.limit) || 100;
            const history = sensorDataService_1.sensorDataService.getHistory(sensorId, limit);
            res.json({
                success: true,
                data: history,
                count: history.length,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get readings by time range
    getReadingsByTimeRange(req, res, next) {
        try {
            const { sensorId } = req.params;
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                res.status(400).json({
                    success: false,
                    message: 'startTime and endTime are required',
                });
                return;
            }
            const readings = sensorDataService_1.sensorDataService.getReadingsByTimeRange(sensorId, startTime, endTime);
            res.json({
                success: true,
                data: readings,
                count: readings.length,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get statistics
    getStats(req, res, next) {
        try {
            const { sensorId } = req.params;
            const stats = sensorDataService_1.sensorDataService.getStats(sensorId);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // // Publish control message
    // publishControl(req: Request, res: Response, next: NextFunction): void {
    //   try {
    //     const { command, value } = req.body;
    //
    //     if (!command) {
    //       res.status(400).json({
    //         success: false,
    //         message: 'command is required',
    //       } as ApiResponse);
    //       return;
    //     }
    //
    //     const controlMessage: IControlMessage = {
    //       command,
    //       value,
    //       timestamp: new Date().toISOString(),
    //     };
    //
    //     const published = mqttService.publish(mqttConfig.topics.magnetControl, controlMessage);
    //
    //     if (!published) {
    //       res.status(503).json({
    //         success: false,
    //         message: 'MQTT service not available',
    //       } as ApiResponse);
    //       return;
    //     }
    //
    //     res.json({
    //       success: true,
    //       message: 'Control command published',
    //       data: controlMessage,
    //     } as ApiResponse);
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    // Get MQTT connection status
    getMqttStatus(_req, res, next) {
        try {
            res.json({
                success: true,
                data: {
                    connected: mqttService_1.mqttService.isConnected,
                    broker: mqtt_1.mqttConfig.broker.url,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.sensorController = new SensorController();
//# sourceMappingURL=sensorController.js.map