"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const sensorRoutes_1 = __importDefault(require("./sensorRoutes"));
const magnetConfigRoutes_1 = __importDefault(require("./magnetConfigRoutes"));
const systemRoutes_1 = __importDefault(require("./systemRoutes"));
const router = (0, express_1.Router)();
router.use('/users', userRoutes_1.default);
router.use('/sensors', sensorRoutes_1.default);
router.use('/configs', magnetConfigRoutes_1.default);
router.use('/system/services', systemRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map