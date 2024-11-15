const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_URL);
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to db'));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    response.send("hello 👋");
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Posts backend is running on port ${port} 🖼️`);
});