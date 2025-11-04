"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.magnetService = exports.MagnetConfigService = void 0;
const MagnetConfig_1 = require("../models/MagnetConfig");
class MagnetConfigService {
    async findAll() {
        return await MagnetConfig_1.MagnetConfig.findAll();
    }
    async updateConfig(magnetConfigs) {
        for (const magnetConfig of magnetConfigs) {
            const config = await MagnetConfig_1.MagnetConfig.update(magnetConfig.id, magnetConfig);
            if (!config) {
                throw new Error(`Config not found: ${magnetConfig.key}`);
            }
        }
        return await this.findAll();
    }
}
exports.MagnetConfigService = MagnetConfigService;
exports.magnetService = new MagnetConfigService();
//# sourceMappingURL=magnetConfigService.js.map