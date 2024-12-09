import * as postController from "../controllers/post_controller";
import express from "express";

const PostRouter = express.Router();

PostRouter.get("/", postController.getAllPosts);

PostRouter.get("/:id", postController.getPostById);

PostRouter.put("/:id", postController.updatePost);

PostRouter.post("/", postController.createPost);

export { PostRouter };
