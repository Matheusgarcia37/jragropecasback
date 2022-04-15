"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//create index of page routes
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_routes_1 = __importDefault(require("./user.routes"));
const produto_routes_1 = __importDefault(require("./produto.routes"));
//rotas da aplicação
router.use('/user', user_routes_1.default);
router.use('/produto', produto_routes_1.default);
router.get('/', (re, res) => {
    return res.status(200).send({ message: 'Bem vindo ao app jr-agropecas.' });
});
exports.default = router;
