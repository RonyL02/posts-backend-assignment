const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    senderId: {
        type: Number,
        required: true
    },
    postId: {
        type: Schema.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const CommentModel = mongoose.model('comments', commentSchema);

module.exports = CommentModel;