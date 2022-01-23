import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import produtoController from "../controllers/produtoController";
const produto = Router();

//create produto
produto.post("/import", authMiddleware, produtoController.import);
produto.get("/", authMiddleware, produtoController.index);
export default produto;