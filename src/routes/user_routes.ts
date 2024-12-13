import express from "express";
import { UserController } from "../controllers/user_controller";
const userController=new UserController();
const UserRouter = express.Router();

UserRouter.get("/", userController.find.bind(userController));

UserRouter.get("/:id", userController.findById.bind(userController));

UserRouter.put("/:id", userController.update.bind(userController));

UserRouter.post("/", userController.create.bind(userController));

UserRouter.delete("/", userController.delete.bind(userController));

export { UserRouter };
