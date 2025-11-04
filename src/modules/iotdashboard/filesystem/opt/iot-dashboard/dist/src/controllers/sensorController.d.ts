import { NextFunction, Request, Response } from 'express';
declare class SensorController {
    getLatestReading(req: Request, res: Response, next: NextFunction): void;
    getAllLatestReadings(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getHistory(req: Request, res: Response, next: NextFunction): void;
    getReadingsByTimeRange(req: Request, res: Response, next: NextFunction): void;
    getStats(req: Request, res: Response, next: NextFunction): void;
    getMqttStatus(_req: Request, res: Response, next: NextFunction): void;
}
export declare const sensorController: SensorController;
export {};
//# sourceMappingURL=sensorController.d.ts.map