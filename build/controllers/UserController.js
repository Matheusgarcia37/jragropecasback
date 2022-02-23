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
const prisma = new client_1.PrismaClient();
class UserController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const userExist = yield prisma.user.findFirst({
                where: {
                    username
                }
            });
            if (userExist) {
                return res.status(400).json({
                    error: 'User already exists'
                });
            }
            //hash password
            const hash = yield bcryptjs_1.default.hash(password, 8);
            const user = yield prisma.user.create({
                data: {
                    username,
                    password: hash
                }
            });
            return res.json(user);
        });
    }
    alter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, username, password } = req.body;
            try {
                const user = yield prisma.user.findUnique({
                    where: { id }
                });
                if (user) {
                    user.username = username;
                    user.password = yield bcryptjs_1.default.hash(password, 8);
                    yield prisma.user.update({
                        where: {
                            id
                        },
                        data: user
                    });
                    return res.status(200).json({
                        message: 'Usuário alterado'
                    });
                }
                else {
                    return res.status(400).json({
                        error: 'Usuário não encontrado'
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: 'Usuário não encontrado'
                });
            }
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma.user.findMany();
            return res.json(users);
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const user = yield prisma.user.findUnique({
                    where: { id }
                });
                if (user) {
                    delete user.password;
                    return res.status(200).json(user);
                }
                else {
                    return res.status(400).json({
                        error: 'Usuário não encontrado'
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: 'Usuário não encontrado'
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                yield prisma.user.delete({
                    where: {
                        id
                    }
                });
                return res.status(200).json({
                    message: 'Usuário deletado'
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).json({
                    error: 'Usuário não encontrado'
                });
            }
        });
    }
}
exports.default = new UserController();
