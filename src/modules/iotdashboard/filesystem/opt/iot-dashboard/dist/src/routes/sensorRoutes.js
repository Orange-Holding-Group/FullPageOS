"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sensorController_1 = require("../controllers/sensorController");
// import { validateSensor } from '../middleware/validator';
const router = (0, express_1.Router)();
// router.get('/', sensorController.getAllSensors);
// router.get('/latest', sensorController.getLatestReadings);
// router.get('/stats', sensorController.getSensorStats);
// router.get('/type/:type', sensorController.getSensorsByType);
// router.get('/:id', sensorController.getSensorById);
// router.post('/', validateSensor, sensorController.createSensor);
// Get all latest readings
router.get('/readings', sensorController_1.sensorController.getAllLatestReadings.bind(sensorController_1.sensorController));
// Get latest reading for specific sensor
router.get('/readings/:sensorId/latest', sensorController_1.sensorController.getLatestReading.bind(sensorController_1.sensorController));
// Get historical data
router.get('/readings/:sensorId/history', sensorController_1.sensorController.getHistory.bind(sensorController_1.sensorController));
// Get readings by time range
// router.get('/readings/:sensorId/range', sensorController.getReadingsByTimeRange.bind(sensorController));
// Get statistics
router.get('/stats', sensorController_1.sensorController.getStats.bind(sensorController_1.sensorController));
router.get('/stats/:sensorId', sensorController_1.sensorController.getStats.bind(sensorController_1.sensorController));
// Publish control command
// router.post('/control', sensorController.publishControl.bind(sensorController));
// Get MQTT status
router.get('/mqtt/status', sensorController_1.sensorController.getMqttStatus.bind(sensorController_1.sensorController));
exports.default = router;
//# sourceMappingURL=sensorRoutes.js.map