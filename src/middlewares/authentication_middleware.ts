import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { Payload, RequestWithUser } from "../types";

export const authenticationMiddleware = (request: RequestWithUser, response: Response, next: NextFunction) => {
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.error('token not found');
        response.status(StatusCodes.UNAUTHORIZED).send();
    } else {
        verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, user) => {
            if (error) {
                console.error(`token is corrupted: ${error}`);
                response.status(StatusCodes.FORBIDDEN).send()
            } else {
                request.user = user as Payload;
            }
        });
    }

    next();
}