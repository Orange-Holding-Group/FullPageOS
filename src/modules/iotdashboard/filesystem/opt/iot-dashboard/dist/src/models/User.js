"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User {
    static async findAll() {
        return (0, database_1.query)('SELECT id, username, email, role, created_at FROM users');
    }
    static async findById(id) {
        return (0, database_1.get)('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
    }
    static async findByEmail(email) {
        return (0, database_1.get)('SELECT * FROM users WHERE email = ?', [email]);
    }
    static async findByUsername(username) {
        return (0, database_1.get)('SELECT * FROM users WHERE username = ?', [username]);
    }
    static async create(userData) {
        const { username, email, password, role = 'user' } = userData;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = (0, database_1.run)('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [
            username,
            email,
            hashedPassword,
            role,
        ]);
        return await this.findById(Number(result.lastInsertRowid));
    }
    static async update(id, userData) {
        const { username, email, role } = userData;
        (0, database_1.run)('UPDATE users SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [username, email, role, id]);
        return await this.findById(id);
    }
    static async delete(id) {
        const result = (0, database_1.run)('DELETE FROM users WHERE id = ?', [id]);
        return result.changes > 0;
    }
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcryptjs_1.default.compare(plainPassword, hashedPassword);
    }
    static async count() {
        const result = (0, database_1.get)('SELECT COUNT(*) as count FROM users');
        return result?.count || 0;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map