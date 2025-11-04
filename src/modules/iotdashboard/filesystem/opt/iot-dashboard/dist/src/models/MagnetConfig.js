"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagnetConfig = void 0;
const database_1 = require("../../database/database");
class MagnetConfig {
    static async findAll(limit = 100) {
        return (0, database_1.query)('SELECT id, category, key, value, data_type as dataType, description, user_editable as userEditable FROM magnet_config LIMIT ?', [limit]);
    }
    static async update(id, magnetData) {
        const { value } = magnetData;
        (0, database_1.run)('UPDATE magnet_config SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
            value,
            id,
        ]);
        return await this.findById(id);
    }
    static async findById(id) {
        return (0, database_1.get)('SELECT id, category, key, value, data_type as dataType, description, user_editable FROM magnet_config WHERE id = ?', [id]);
    }
}
exports.MagnetConfig = MagnetConfig;
//# sourceMappingURL=MagnetConfig.js.map