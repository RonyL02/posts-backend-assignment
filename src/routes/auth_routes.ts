import { Router } from "express";
import { AuthController } from "../controllers/auth_controller";

const AuthRouter = Router()
const authController = new AuthController()
AuthRouter.post('/login', authController.login.bind(authController))

AuthRouter.post('/logout', authController.logout.bind(authController))

AuthRouter.post('/refreshToken', authController.refreshToken.bind(authController))

export { AuthRouter }