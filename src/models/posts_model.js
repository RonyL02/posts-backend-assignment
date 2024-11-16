const mongoose = require('mongoose')
const Schema = mongoose.Schema


const postSchema = new Schema({
    senderId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
})

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;