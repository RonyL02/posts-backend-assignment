import mongoose from "mongoose";

export type IPost = {
  senderId: number;
  title: string;
  content: string;
  _id: string
}

const Schema = mongoose.Schema;

const postSchema = new Schema({
  senderId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export const PostModel = mongoose.model("Posts", postSchema);
