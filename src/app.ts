
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { CommentRouter } from './routes/comment_routes';
import { PostRouter } from './routes/post_routes';


dotenv.config();

const dbConnectionUrl = process.env.DB_CONNECTION_URL;
if (!dbConnectionUrl) {
    throw new Error('DB_CONNECTION_URL is not defined');
}
mongoose.connect(dbConnectionUrl);
const db = mongoose.connection;
db.on('error', (error: Error) => console.error(error));
db.once('open', () => console.log('connected to db'));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/comments', CommentRouter);
app.use('/posts', PostRouter);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Posts backend is running on port ${port} 🖼️`);
});
