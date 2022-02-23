"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const produtoController_1 = __importDefault(require("../controllers/produtoController"));
const multer_1 = __importDefault(require("multer"));
const multer_2 = __importDefault(require("../config/multer"));
const produto = (0, express_1.Router)();
//create produto
produto.post("/import", authMiddleware_1.default, produtoController_1.default.import);
produto.get("/", produtoController_1.default.index);
produto.post("/", (0, multer_1.default)(multer_2.default).array('file'), produtoController_1.default.store);
produto.post("/getProdutoById", produtoController_1.default.getProdutoById);
produto.put("/", (0, multer_1.default)(multer_2.default).array('file'), produtoController_1.default.alter);
produto.put("/images", (0, multer_1.default)(multer_2.default).array('file'), produtoController_1.default.alterImagesOfProd);
produto.delete("/images/:id", produtoController_1.default.deleteImage);
produto.delete("/", produtoController_1.default.delete);
exports.default = produto;
