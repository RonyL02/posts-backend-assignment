import * as UserController from "../controllers/user_controller";
import express from "express";

const UserRouter = express.Router();

UserRouter.get("/", UserController.getAllUsers);

UserRouter.get("/:id", UserController.getUserById);

UserRouter.put("/:id", UserController.updateUser);

UserRouter.post("/", UserController.createUser);

UserRouter.post("/", UserController.deleteUser);

export { UserRouter };
