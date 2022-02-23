"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: "Token not provided"
        });
    }
    const [, token] = authorization.split(" ");
    if (!token) {
        return res.status(401).json({
            error: "Token not provided"
        });
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.APP_SECRET || "");
        const { id, username } = data;
        req.userId = id;
        req.username = username;
        return next();
    }
    catch (error) {
        return res.status(401).json({
            error: "Token invalid"
        });
    }
}
exports.default = authMiddleware;
