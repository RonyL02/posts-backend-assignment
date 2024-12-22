import express from "express";
import { PostController } from "../controllers/post_controller";
const postController=new PostController();
const PostRouter = express.Router();

PostRouter.get("/", postController.find.bind(postController));

PostRouter.get("/:id", postController.findById.bind(postController));

PostRouter.put("/:id", postController.update.bind(postController));

PostRouter.post("/", postController.create.bind(postController));

export { PostRouter };
