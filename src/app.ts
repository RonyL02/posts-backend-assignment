
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { CommentRouter } from './routes/comment_routes';
import { PostRouter } from './routes/post_routes';
import { UserRouter } from './routes/user_routes';
import { AuthRouter } from './routes/auth_routes';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { Express } from 'express';
dotenv.config();

const initDB = async () => {
    const dbConnectionUrl = process.env.DB_CONNECTION_URL;
    if (!dbConnectionUrl) {
        throw new Error('DB_CONNECTION_URL is not defined');
    }

    try {
        await mongoose.connect(dbConnectionUrl);
        console.log('connected to db')
    } catch (error) {
        console.error(`failed connecting to db: ${error}`);
    }
}

export const initSwagger = (app: Express) => {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev Assignment 2 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000" }]
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);

    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
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

