
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { CommentRouter } from './routes/comment_routes';
import { PostRouter } from './routes/post_routes';
import { UserRouter } from './routes/user_routes';
import { AuthRouter } from './routes/auth_routes';


dotenv.config();

const initDB = async () => {
    const dbConnectionUrl = process.env.DB_CONNECTION_URL;
    if (!dbConnectionUrl) {
        throw new Error('DB_CONNECTION_URL is not defined');
    }

    try {
        await mongoose.connect(dbConnectionUrl, {});
        console.log('connected to db')
    } catch (error) {
        console.error(`failed connecting to db: ${error}`);
    }
}

export const initApp = async () => {
    await initDB();

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/comments', CommentRouter);
    app.use('/posts', PostRouter);
    app.use('/users', UserRouter);
    app.use('/auth', AuthRouter);

    return app;
}

