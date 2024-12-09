import express from 'express';
const CommentController = require('../controllers/comment_controller');

const router = express.Router();

router.post('/', CommentController.createComment.bind(CommentController));

router.get('/', CommentController.getComments.bind(CommentController));

router.put('/:id', CommentController.updateComment.bind(CommentController));

router.delete('/:id', CommentController.deleteComment.bind(CommentController));

module.exports = router;