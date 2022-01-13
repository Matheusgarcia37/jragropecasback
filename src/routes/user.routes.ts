import { Router } from "express";
import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";
import authMiddleware from "../middlewares/authMiddleware";
const user = Router();

//create user
user.post("/", UserController.store);
user.put("/", UserController.alter);
user.post("/auth", AuthController.authenticate);
user.post("/getUserByToken", AuthController.getUserByToken);
user.post("/getUserById", UserController.getUserById);
user.get("/", authMiddleware, UserController.index);
user.delete("/", authMiddleware, UserController.delete);


export default user;