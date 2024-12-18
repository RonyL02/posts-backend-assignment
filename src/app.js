const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CommentRouter = require('./routes/comment_routes');
const PostRouter = require('./routes/post_routes');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_URL);
const db = mongoose.connection;
db.on('error', error => console.error(error));
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
