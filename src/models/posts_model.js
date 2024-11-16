const mongoose = require('mongoose')
const Schema = mongoose.Schema


const postSchema = new Schema({
    senderId: Number,
    title: {
        type: String,
        required: true
    },
    content: String,
})

const postModel  = mongoose.model("posts",postSchema)
module.exports = postModel