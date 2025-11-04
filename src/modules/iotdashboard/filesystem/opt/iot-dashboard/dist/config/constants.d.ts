import { MetricRule } from '../src/email/types/email-types';
export declare const ROLES: {
    readonly ADMIN: "admin";
    readonly USER: "user";
    readonly MODERATOR: "moderator";
};
export declare const SENSOR_TYPES: {
    readonly TEMPERATURE: "temperature";
    readonly HUMIDITY: "humidity";
    readonly PRESSURE: "pressure";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_ERROR: 500;
};
export type UserRole = (typeof ROLES)[keyof typeof ROLES];
export type SensorType = (typeof SENSOR_TYPES)[keyof typeof SENSOR_TYPES];
export declare const METRIC_RULES: Record<string, MetricRule>;
//# sourceMappingURL=constants.d.ts.map