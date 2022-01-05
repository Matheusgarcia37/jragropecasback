import { Router } from "express";
import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";
import authMiddleware from "../middlewares/authMiddleware";
const user = Router();

//create user
user.post("/", UserController.store);
user.post("/auth", AuthController.authenticate);
user.get("/", authMiddleware, UserController.index);


export default user;