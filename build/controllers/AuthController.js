"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class AuthController {
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const user = yield prisma.user.findFirst({ where: { username } });
            if (!user) {
                return res.status(400).json({
                    error: 'Usuário não encontrado'
                });
            }
            const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({
                    error: 'Senha invalida'
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                username: user.username
            }, process.env.APP_SECRET || '', {
                expiresIn: '1d'
            });
            user.password = undefined;
            return res.json({
                user,
                token
            });
        });
    }
    getUserByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            try {
                const decodeToken = jsonwebtoken_1.default.decode(token);
                const userId = decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.id;
                const user = yield prisma.user.findUnique({ where: { id: userId } });
                if (!user) {
                    return res.status(400).json({
                        error: 'Usuário não encontrado'
                    });
                }
                user.password = undefined;
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(400).json({
                    error: 'Token inválido'
                });
            }
        });
    }
}
exports.default = new AuthController();
