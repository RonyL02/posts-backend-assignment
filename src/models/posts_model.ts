import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IPost extends Document {
  senderId: number;
  title: string;
  content: string;
}

const postSchema = new Schema<IPost>({
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

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;