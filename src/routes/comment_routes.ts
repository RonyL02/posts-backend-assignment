import express from 'express';
import * as CommentController from '../controllers/comment_controller';


const CommentRouter = express.Router();

CommentRouter.post('/', CommentController.createComment);

CommentRouter.get('/', CommentController.getComments);

CommentRouter.put('/:id', CommentController.updateComment);

CommentRouter.delete('/:id', CommentController.deleteComment);

export { CommentRouter };
