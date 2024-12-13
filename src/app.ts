
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { CommentRouter } from './routes/comment_routes';
import { PostRouter } from './routes/post_routes';
import { UserRouter } from './routes/user_routes';

dotenv.config();

const initDB = async () => {
    const dbConnectionUrl = process.env.DB_CONNECTION_URL;
    if (!dbConnectionUrl) {
        throw new Error('DB_CONNECTION_URL is not defined');
    }
    
    await mongoose.connect(dbConnectionUrl);

    const db = mongoose.connection;
    db.on('error', (error: Error) => console.error(error));
    db.once('open', () => console.log('connected to db'));
}

export const initApp = async () => {
    await initDB();

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/comments', CommentRouter);
    app.use('/posts', PostRouter);
    app.use('/users', UserRouter);
    
    return app;
}

const start = async ()=>{
    const app = await initApp();

    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`Posts backend is running on port ${port} 🖼️`);
    });
}

start();