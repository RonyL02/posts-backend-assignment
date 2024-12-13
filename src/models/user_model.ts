import mongoose from "mongoose";

export type IUser = {
    username: string;
    password: string
    email: string
    _id: string
}

const Schema = mongoose.Schema;

const postSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

export const UserModel = mongoose.model("Users", postSchema);
