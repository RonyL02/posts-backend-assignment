import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import { IUser, UserModel } from "../models/user_model";
import { StatusCodes } from "http-status-codes";
import { genSalt, hash } from 'bcrypt'
import { sendError } from "../utils";
export class UserController extends BaseController<IUser> {
    constructor() {
        super(UserModel);
    }

    async create(request: Request, response: Response) {
        const user = request.body
        const email = user.email
        const password = user.password

        if (!(email && password)) {
            return sendError(response, StatusCodes.BAD_REQUEST, 'invalid credentials');
        }

        try {
            const user = await this.model.findOne({
                email
            })

            if (user) {
                return sendError(response, StatusCodes.CONFLICT, 'user already exists');
            }
        } catch (error) {
            return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, JSON.stringify(error));
        }

        try {
            const salt = await genSalt(10);
            const password = await hash(user.password, salt);

            const newUser = {
                ...user,
                password
            };

            request.body = newUser;

            await super.create(request, response);
        } catch (error) {
            sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, JSON.stringify(error));
        }
    }
}