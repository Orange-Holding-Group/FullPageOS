"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METRIC_RULES = exports.HTTP_STATUS = exports.SENSOR_TYPES = exports.ROLES = void 0;
exports.ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator',
};
exports.SENSOR_TYPES = {
    TEMPERATURE: 'temperature',
    HUMIDITY: 'humidity',
    PRESSURE: 'pressure',
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};
exports.METRIC_RULES = {
    sm_magnet_psi_a: {
        stableValue: 15.31,
        threshold: 0.05,
    },
};
//# sourceMappingURL=constants.js.map