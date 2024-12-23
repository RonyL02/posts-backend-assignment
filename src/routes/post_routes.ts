import express from "express";
import { PostController } from "../controllers/post_controller";
import { authenticationMiddleware } from "../middlewares/authentication_middleware";
const postController=new PostController();
const PostRouter = express.Router();

PostRouter.use(authenticationMiddleware);

PostRouter.get("/", postController.find.bind(postController));

PostRouter.get("/:id", postController.findById.bind(postController));

PostRouter.put("/:id", postController.update.bind(postController));

PostRouter.post("/", postController.create.bind(postController));

export { PostRouter };
