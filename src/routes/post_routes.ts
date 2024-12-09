const postController = require("../controllers/post_controller");
const express = require("express");

const router = express.Router();

router.get("/", postController.getAllPosts.bind(postController));

router.get("/:id", postController.getPostById.bind(postController));

router.put("/:id", postController.updatePost.bind(postController));

router.post("/", postController.createPost.bind(postController));

module.exports = router;