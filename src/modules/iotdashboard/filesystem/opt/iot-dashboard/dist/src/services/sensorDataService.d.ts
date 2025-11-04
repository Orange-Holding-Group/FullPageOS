import { EventEmitter } from 'events';
import { ISensorReading } from '../types';
import { EmailService } from './emailService';
interface SensorDataServiceEvents {
    newReading: (reading: ISensorReading) => void;
}
export declare interface SensorDataService {
    on<K extends keyof SensorDataServiceEvents>(event: K, listener: SensorDataServiceEvents[K]): this;
    emit<K extends keyof SensorDataServiceEvents>(event: K, ...args: Parameters<SensorDataServiceEvents[K]>): boolean;
}
export declare class SensorDataService extends EventEmitter {
    private latestData;
    private dataHistory;
    private readonly maxHistorySize;
    emailService: EmailService;
    lastEmailSentAt: Date | null;
    constructor();
    addReading<T>(sensorId: string, data: T): Promise<ISensorReading<T>>;
    getLatestReading(sensorId: string): ISensorReading | undefined;
    getAllLatestReadings(): Promise<ISensorReading>;
    private validateSensorReading;
    getHistory(sensorId?: string, limit?: number): ISensorReading[];
    getReadingsByTimeRange(sensorId: string | undefined, startTime: string, endTime: string): ISensorReading[];
    clearHistory(sensorId?: string): void;
    getStats(sensorId?: string): {
        totalReadings: number;
        firstReading: string | null;
        lastReading: string | null;
        sensors: string[];
    };
}
export declare const sensorDataService: SensorDataService;
export {};
//# sourceMappingURL=sensorDataService.d.ts.map