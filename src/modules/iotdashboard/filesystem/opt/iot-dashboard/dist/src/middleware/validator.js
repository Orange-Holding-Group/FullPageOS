"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSensor = exports.validateUserUpdate = exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../../config/constants");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    next();
};
exports.validateUser = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters'),
    (0, express_validator_1.body)('role').optional().isIn(['admin', 'user', 'moderator']).withMessage('Invalid role'),
    handleValidationErrors,
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail().withMessage('Must be a valid email'),
    (0, express_validator_1.body)('role').optional().isIn(['admin', 'user', 'moderator']).withMessage('Invalid role'),
    handleValidationErrors,
];
exports.validateSensor = [
    (0, express_validator_1.body)('type')
        .isIn(Object.values(constants_1.SENSOR_TYPES))
        .withMessage(`Type must be one of: ${Object.values(constants_1.SENSOR_TYPES).join(', ')}`),
    (0, express_validator_1.body)('value').isFloat().withMessage('Value must be a number'),
    (0, express_validator_1.body)('unit')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Unit must be a string with max 20 characters'),
    (0, express_validator_1.body)('user_id').optional().isInt().withMessage('User ID must be an integer'),
    handleValidationErrors,
];
//# sourceMappingURL=validator.js.map