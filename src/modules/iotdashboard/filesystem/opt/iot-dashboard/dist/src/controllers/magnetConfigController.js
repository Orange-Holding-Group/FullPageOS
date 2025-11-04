"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigs = exports.getConfig = void 0;
const response_1 = require("../utils/response");
const MagnetConfig_1 = require("../models/MagnetConfig");
const magnetConfigService_1 = require("../services/magnetConfigService");
const getConfig = async (_req, res) => {
    try {
        const configs = await magnetConfigService_1.magnetService.findAll();
        (0, response_1.sendSuccess)(res, configs);
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.getConfig = getConfig;
const updateConfigs = async (req, res) => {
    try {
        const magnetConfigs = req.body;
        await magnetConfigService_1.magnetService.updateConfig(magnetConfigs);
        (0, response_1.sendSuccess)(res, await MagnetConfig_1.MagnetConfig.findAll());
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.updateConfigs = updateConfigs;
//# sourceMappingURL=magnetConfigController.js.map