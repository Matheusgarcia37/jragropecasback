import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import produtoController from "../controllers/produtoController";
import multer from "multer";
import multerConfig from "../config/multer";
const produto = Router();

//create produto
produto.post("/import", authMiddleware, produtoController.import);
produto.get("/", produtoController.index);
produto.post("/", multer(multerConfig).array('file'), produtoController.store);
produto.post("/getProdutoById", produtoController.getProdutoById);
produto.get("/destaque", produtoController.findDestaques);
produto.put("/", multer(multerConfig).array('file'), produtoController.alter);
produto.put("/images", multer(multerConfig).array('file'), produtoController.alterImagesOfProd);
produto.delete("/images/:id" , produtoController.deleteImage);
produto.delete("/", produtoController.delete);
export default produto;