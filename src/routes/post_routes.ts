import * as PostController from "../controllers/post_controller";
import express from "express";

const PostRouter = express.Router();

PostRouter.get("/", PostController.getAllPosts);

PostRouter.get("/:id", PostController.getPostById);

PostRouter.put("/:id", PostController.updatePost);

PostRouter.post("/", PostController.createPost);

export { PostRouter };
