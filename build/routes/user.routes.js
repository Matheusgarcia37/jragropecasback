"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const user = (0, express_1.Router)();
//create user
user.post("/", UserController_1.default.store);
user.put("/", UserController_1.default.alter);
user.post("/auth", AuthController_1.default.authenticate);
user.post("/getUserByToken", AuthController_1.default.getUserByToken);
user.post("/getUserById", UserController_1.default.getUserById);
user.get("/", authMiddleware_1.default, UserController_1.default.index);
user.delete("/", authMiddleware_1.default, UserController_1.default.delete);
exports.default = user;
