const postController = require("../controllers/post_controller.js");
const express = require("express");

const router = express.Router();

router.get("/", postController.getAllPosts);

router.get("/:id", postController.getPostById);

router.put("/:id", postController.updatePost);

router.post("/", postController.createPost);

module.exports = router;
