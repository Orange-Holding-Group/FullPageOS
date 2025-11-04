import Database from 'better-sqlite3';
export declare class Migrator {
    private db;
    private migrationsDir;
    constructor(dbPath: string, migrationsDir: string);
    private initMigrationsTable;
    private getExecutedMigrations;
    private getMigrationFiles;
    up(): Promise<void>;
    down(): Promise<void>;
    status(): void;
    close(): void;
    getDatabase(): Database.Database;
}
//# sourceMappingURL=migrator.d.ts.map