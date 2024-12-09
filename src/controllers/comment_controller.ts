
import CommentModel from '../models/comment_model';
import { Request, Response } from 'express';

const createComment = async (request:Request, response:Response) => {
    const newComment = request.body;

    try {
        const { _id: newCommentId } = await CommentModel.create(newComment);

        response.status(201).send({ newCommentId });
    } catch (error) {
        console.error((error as any).message);

        response.status(400).send();
    }
}

const getComments = async (request:Request, response:Response) => {
    const postFilter = request.query.post;

    try {
        const comments = await CommentModel.find(postFilter ? { postId: postFilter } : {});
        response.send(comments);
    } catch (error) {
        console.error((error as any).message);
        response.status(400).send();
    }
}

const updateComment = async (request:Request, response:Response) => {
    const commentId = request.params.id;
    const updatedComment = request.body;

    try {
        await CommentModel.findByIdAndUpdate(commentId, updatedComment);
        response.send();
    } catch (error) {
        console.error((error as any).message);
        response.status(400).send();
    }
}

const deleteComment = async (request:Request, response:Response) => {
    const commentId = request.params.id;

    try {
        await CommentModel.findByIdAndDelete(commentId);
        response.send();
    } catch (error) {
        console.error((error as any).message);
        response.status(400).send();
    }
}
export { createComment, getComments, updateComment, deleteComment };
