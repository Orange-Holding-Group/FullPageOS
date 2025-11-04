"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import rateLimit from 'express-rate-limit';
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./src/routes"));
const errorHandler_1 = require("./src/middleware/errorHandler");
const database_1 = require("./database/database");
const mqttService_1 = require("./src/services/mqttService");
const sensorDataService_1 = require("./src/services/sensorDataService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    originAgentCluster: false,
    frameguard: { action: 'sameorigin' },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.use((0, cors_1.default)());
// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use('/api/', limiter);
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Initialize database
(0, database_1.initDatabase)();
// Initialize MQTT connection
mqttService_1.mqttService.connect();
// Handle MQTT events
mqttService_1.mqttService.on('magnetState', (data) => {
    console.log('Received magnet state:', data);
    sensorDataService_1.sensorDataService.addReading('magnet-sensor-1', data);
});
mqttService_1.mqttService.on('connected', () => {
    console.log('MQTT service ready');
});
mqttService_1.mqttService.on('error', (error) => {
    console.error('MQTT service error:', error);
});
// API routes
app.use('/api', routes_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});
// Serve static files from Vue build (production)
const clientPath = path_1.default.join(__dirname, 'client');
app.use(express_1.default.static(clientPath));
// SPA fallback - serve index.html for all non-API routes
app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path_1.default.join(clientPath, 'index.html'));
});
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
// Start server
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`📁 Database: ${process.env.DB_PATH}`);
    console.log(`🌐 Accessible from: http://localhost:${PORT}`);
    console.log(`🌐 Accessible from your network at: http://<your-device-ip>:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map