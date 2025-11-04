import { ISensorReading } from '../types';
export declare class SensorReading<T = any> implements ISensorReading<T> {
    sensorId: string;
    data: T;
    timestamp: string;
    constructor(sensorId: string, data: T, timestamp?: string);
    toJSON(): ISensorReading<T>;
}
//# sourceMappingURL=SensorReading.d.ts.map