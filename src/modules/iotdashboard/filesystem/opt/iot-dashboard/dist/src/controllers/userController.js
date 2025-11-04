"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const response_1 = require("../utils/response");
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.default.findAll();
        (0, response_1.sendSuccess)(res, users);
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const userId = Number.parseInt(req.params.id, 10);
        if (Number.isNaN(userId)) {
            (0, response_1.sendError)(res, 'Invalid user ID', 400);
            return;
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            (0, response_1.sendError)(res, 'User not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, user);
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findByEmail(userData.email);
        if (existingUser) {
            (0, response_1.sendError)(res, 'Email already exists', 400);
            return;
        }
        const existingUsername = await User_1.default.findByUsername(userData.username);
        if (existingUsername) {
            (0, response_1.sendError)(res, 'Username already exists', 400);
            return;
        }
        const user = await User_1.default.create(userData);
        (0, response_1.sendSuccess)(res, user, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const userId = Number.parseInt(req.params.id, 10);
        const userData = req.body;
        if (Number.isNaN(userId)) {
            (0, response_1.sendError)(res, 'Invalid user ID', 400);
            return;
        }
        const user = await User_1.default.update(userId, userData);
        if (!user) {
            (0, response_1.sendError)(res, 'User not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, user);
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userId = Number.parseInt(req.params.id, 10);
        if (Number.isNaN(userId)) {
            (0, response_1.sendError)(res, 'Invalid user ID', 400);
            return;
        }
        const deleted = await User_1.default.delete(userId);
        if (!deleted) {
            (0, response_1.sendError)(res, 'User not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, { message: 'User deleted successfully' });
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.deleteUser = deleteUser;
const getUserStats = async (_req, res) => {
    try {
        const count = await User_1.default.count();
        (0, response_1.sendSuccess)(res, { totalUsers: count });
    }
    catch (error) {
        (0, response_1.sendError)(res, error.message, 500);
    }
};
exports.getUserStats = getUserStats;
//# sourceMappingURL=userController.js.map