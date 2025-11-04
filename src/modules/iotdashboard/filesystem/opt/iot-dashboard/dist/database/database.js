"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.get = exports.query = exports.initDatabase = void 0;
exports.getDbInstance = getDbInstance;
exports.closeDatabase = closeDatabase;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const migrator_1 = require("./migrator");
const DB_PATH = process.env.DB_PATH || path_1.default.join(__dirname, 'app.db');
const MIGRATIONS_DIR = path_1.default.join(__dirname, './migrations');
// Create a singleton database connection
let db = null;
function getDbInstance() {
    if (!db) {
        const dbDir = path_1.default.dirname(DB_PATH); // Ensure database directory exists
        if (!fs_1.default.existsSync(dbDir)) {
            fs_1.default.mkdirSync(dbDir, { recursive: true });
        }
        db = new better_sqlite3_1.default(DB_PATH, { verbose: console.log }); // Enable foreign keys
        db.pragma('foreign_keys = ON');
        db.pragma('journal_mode = WAL'); // Performance optimizations
        console.log('Database connection established');
    }
    return db;
}
// Initialize database tables
const initDatabase = async () => {
    console.log('Initializing database...');
    const migrator = new migrator_1.Migrator(DB_PATH, MIGRATIONS_DIR);
    try {
        await migrator.up();
        migrator.close();
        console.log('Database ready');
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};
exports.initDatabase = initDatabase;
// Helper function to run queries
const query = (sql, params = []) => {
    const stmt = getDbInstance().prepare(sql);
    return stmt.all(...params);
};
exports.query = query;
// Helper function to run single query
const get = (sql, params = []) => {
    const stmt = getDbInstance().prepare(sql);
    return stmt.get(...params);
};
exports.get = get;
// Helper function to run insert/update/delete
const run = (sql, params = []) => {
    const stmt = getDbInstance().prepare(sql);
    return stmt.run(...params);
};
exports.run = run;
function closeDatabase() {
    if (db) {
        db.close();
        db = null;
        console.log('Database connection closed');
    }
}
// Graceful shutdown
process.on('SIGINT', () => {
    closeDatabase();
    process.exit(0);
});
process.on('SIGTERM', () => {
    closeDatabase();
    process.exit(0);
});
exports.default = getDbInstance;
//# sourceMappingURL=database.js.map