"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceAction = exports.getStatus = exports.getServices = void 0;
const response_1 = require("../utils/response");
const systemService_1 = require("../services/systemService");
const getServices = async (_req, res) => {
    try {
        const services = await systemService_1.systemService.findAll();
        (0, response_1.sendSuccess)(res, services);
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.getServices = getServices;
const getStatus = async (req, res) => {
    try {
        const serviceName = systemService_1.Service[req.params.service];
        const configs = await systemService_1.systemService.getServiceStatus(serviceName);
        (0, response_1.sendSuccess)(res, configs);
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.getStatus = getStatus;
const serviceAction = async (req, res) => {
    try {
        const serviceName = req.body.serviceName;
        const action = req.body.action;
        if (!serviceName) {
            (0, response_1.sendError)(res, 'Service not found', 404);
            return;
        }
        if (!action) {
            (0, response_1.sendError)(res, `Invalid action. Use ${Object.keys(systemService_1.ServiceAction)}`, 404);
            return;
        }
        await systemService_1.systemService.serviceAction(serviceName, action);
        // Wait a moment for the service to change state
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const status = await systemService_1.systemService.getServiceStatus(serviceName);
        console.log('Service status after action:', status);
        const data = {
            message: `Service ${action}ed successfully`,
            service: req.params.service,
            status: status,
        };
        (0, response_1.sendSuccess)(res, data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.serviceAction = serviceAction;
//# sourceMappingURL=systemController.js.map