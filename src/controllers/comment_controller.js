const CommentModel = require('../models/comment_model');

const createComment = async (request, response) => {
    const newPost = request.body;

    try {
        const { _id: newCommentId } = await CommentModel.create(newPost);

        response.status(201).send({ newCommentId });
    } catch (error) {
        console.error(error.message);

        response.status(400).send();
    }
}

const getComments = async (request, response) => {
    const postFilter = request.query.post;

    try {
        const comments = await CommentModel.find(postFilter ? { postId: postFilter } : {});
        response.send(comments);
    } catch (error) {
        console.error(error.message);
        response.status(400).send();
    }
}

const updateComment = async (request, response) => {
    const commentId = request.params.id;
    const updatedComment = request.body;

    try {
        await CommentModel.findByIdAndUpdate(commentId, updatedComment);
        response.send();
    } catch (error) {
        console.error(error.message);
        response.status(400).send();
    }
}

const deleteComment = async (request, response) => {
    const commentId = request.params.id;

    try {
        await CommentModel.findByIdAndDelete(commentId);
        response.send();
    } catch (error) {
        console.error(error.message);
        response.status(400).send();
    }
}

module.exports = { createComment, getComments, updateComment, deleteComment };