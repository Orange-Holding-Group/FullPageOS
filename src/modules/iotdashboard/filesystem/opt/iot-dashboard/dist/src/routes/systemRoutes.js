"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const systemController_1 = require("../controllers/systemController");
const router = (0, express_1.Router)();
router.get('/', systemController_1.getServices);
router.get('/status/:service', systemController_1.getStatus);
router.post('/action', systemController_1.serviceAction);
exports.default = router;
//# sourceMappingURL=systemRoutes.js.map