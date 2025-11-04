"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrator = void 0;
// database/migrator.ts
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Migrator {
    constructor(dbPath, migrationsDir) {
        this.db = new better_sqlite3_1.default(dbPath);
        this.migrationsDir = migrationsDir;
        this.initMigrationsTable();
    }
    initMigrationsTable() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    getExecutedMigrations() {
        const stmt = this.db.prepare('SELECT name FROM migrations ORDER BY id');
        const results = stmt.all();
        return results.map((row) => row.name);
    }
    getMigrationFiles() {
        if (!fs_1.default.existsSync(this.migrationsDir)) {
            fs_1.default.mkdirSync(this.migrationsDir, { recursive: true });
            return [];
        }
        return fs_1.default
            .readdirSync(this.migrationsDir)
            .filter((file) => file.endsWith('.sql'))
            .sort();
    }
    async up() {
        const executed = this.getExecutedMigrations();
        const files = this.getMigrationFiles();
        const pending = files.filter((file) => !executed.includes(file));
        if (pending.length === 0) {
            console.log('✓ No pending migrations');
            return;
        }
        console.log(`Running ${pending.length} migration(s)...`);
        for (const file of pending) {
            const filePath = path_1.default.join(this.migrationsDir, file);
            const sql = fs_1.default.readFileSync(filePath, 'utf8');
            try {
                this.db.exec('BEGIN');
                // Execute migration
                this.db.exec(sql);
                // Record migration
                const stmt = this.db.prepare('INSERT INTO migrations (name) VALUES (?)');
                stmt.run(file);
                this.db.exec('COMMIT');
                console.log(`✓ Executed: ${file}`);
            }
            catch (error) {
                this.db.exec('ROLLBACK');
                console.error(`✗ Failed: ${file}`);
                throw error;
            }
        }
        console.log('✓ All migrations completed');
    }
    async down() {
        const executed = this.getExecutedMigrations();
        if (executed.length === 0) {
            console.log('✓ No migrations to rollback');
            return;
        }
        const lastMigration = executed[executed.length - 1];
        console.log(`Rolling back: ${lastMigration}`);
        // Check for down migration file
        const downFile = lastMigration.replace('.sql', '.down.sql');
        const downPath = path_1.default.join(this.migrationsDir, downFile);
        if (!fs_1.default.existsSync(downPath)) {
            console.error(`✗ No rollback file found: ${downFile}`);
            return;
        }
        const sql = fs_1.default.readFileSync(downPath, 'utf8');
        try {
            this.db.exec('BEGIN');
            this.db.exec(sql);
            const stmt = this.db.prepare('DELETE FROM migrations WHERE name = ?');
            stmt.run(lastMigration);
            this.db.exec('COMMIT');
            console.log(`✓ Rolled back: ${lastMigration}`);
        }
        catch (error) {
            this.db.exec('ROLLBACK');
            console.error(`✗ Rollback failed: ${lastMigration}`);
            throw error;
        }
    }
    status() {
        const executed = this.getExecutedMigrations();
        const files = this.getMigrationFiles();
        const pending = files.filter((file) => !executed.includes(file));
        console.log('\nMigration Status:');
        console.log('================');
        if (executed.length > 0) {
            console.log('\nExecuted:');
            executed.forEach((name) => console.log(`  ✓ ${name}`));
        }
        if (pending.length > 0) {
            console.log('\nPending:');
            pending.forEach((name) => console.log(`  ○ ${name}`));
        }
        if (executed.length === 0 && pending.length === 0) {
            console.log('  No migrations found');
        }
    }
    close() {
        this.db.close();
    }
    getDatabase() {
        return this.db;
    }
}
exports.Migrator = Migrator;
//# sourceMappingURL=migrator.js.map