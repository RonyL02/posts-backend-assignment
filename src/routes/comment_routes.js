const express = require('express');
const CommentController = require('../controllers/comment_controller');

const router = express.Router();

router.post('/', CommentController.createComment);

router.get('/', CommentController.getComments);

router.put('/:id', CommentController.updateComment);

router.delete('/:id', CommentController.deleteComment);

module.exports = router;