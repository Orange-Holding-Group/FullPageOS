"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, statusCode = 200) => {
    const response = {
        success: true,
        data,
    };
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 400) => {
    const response = {
        success: false,
        error: { message },
    };
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map