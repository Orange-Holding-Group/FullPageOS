import Database from 'better-sqlite3';
export declare function getDbInstance(): Database.Database;
export declare const initDatabase: () => Promise<void>;
export declare const query: <T = any>(sql: string, params?: any[]) => T[];
export declare const get: <T = any>(sql: string, params?: any[]) => T | undefined;
export declare const run: (sql: string, params?: any[]) => Database.RunResult;
export declare function closeDatabase(): void;
export default getDbInstance;
//# sourceMappingURL=database.d.ts.map