import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IComment extends Document {
  senderId: number;
  postId: string;
  content: string;
}

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

const commentModel = mongoose.model<IComment>("Comments", commentSchema);

export default commentModel;