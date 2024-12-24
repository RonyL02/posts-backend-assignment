import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import { IUser, UserModel } from "../models/user_model";
import { StatusCodes } from "http-status-codes";
import { genSalt, hash } from 'bcrypt'
export class UserController extends BaseController<IUser> {
    constructor() {
        super(UserModel);
    }

    async create(request: Request, response: Response) {
        const user = request.body
        const email = user.email
        const password = user.password

        if (!(email && password)) {
            console.error('invalid credentials');
            response.status(StatusCodes.BAD_REQUEST)
            return
        }

        try {
            const user = await this.model.findOne({
                email
            })

            if (user) {
                console.error('user already exists');
                response.status(StatusCodes.CONFLICT).send()
                return
            }
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
            return
        }

        try {
            const salt = await genSalt(10)
            const password = await hash(user.password, salt)

            const newUser = {
                ...user,
                password
            }

            request.body = newUser

            await super.create(request, response)
        } catch (error) {
            console.error('failed creating user', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
        }
    }
}