import express from 'express';
import { CommentController } from '../controllers/comment_controller';
const commentController=new CommentController();
const CommentRouter = express.Router();

CommentRouter.post('/', commentController.create.bind(commentController));

CommentRouter.get('/', commentController.find.bind(commentController));

CommentRouter.put('/:id',  commentController.update.bind(commentController));

CommentRouter.delete('/:id', commentController.delete.bind(commentController));

CommentRouter.get('/:id', commentController.findById.bind(commentController));

export { CommentRouter };
