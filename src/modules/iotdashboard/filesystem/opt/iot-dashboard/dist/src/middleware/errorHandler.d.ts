import { Request, Response } from 'express';
interface AppError extends Error {
    statusCode?: number;
}
export declare const errorHandler: (err: AppError, _req: Request, res: Response) => void;
export {};
//# sourceMappingURL=errorHandler.d.ts.map