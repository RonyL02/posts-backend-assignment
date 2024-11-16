const CommentModel = require('../models/comment_model');

const createComment = async (request, response) => {
    const newPost = request.body;

    try {
        const { _id: newPostId } = await CommentModel.create(newPost);

        response.send({ newPostId });
    } catch (error) {
        console.error(error.message);

        response.status(400).send();
    }
}

const getComments = async (request, response) => {
    const postFilter = request.query.post;

    const comments = [];

    try {
        if (postFilter) {
            comments = await CommentModel.find({ postId: postFilter });
        } else {
            comments = await CommentModel.find();
        }

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
        await CommentModel.updateOne({ _id: commentId }, updatedComment);
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