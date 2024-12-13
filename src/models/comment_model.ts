import mongoose from "mongoose";

export type IComment = {
  senderId: number;
  postId: string;
  content: string;
  _id: string;
}

const Schema = mongoose.Schema;

const commentSchema = new Schema<IComment>({
  senderId: {
    type: Number,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export const CommentModel = mongoose.model<IComment>("Comments", commentSchema);