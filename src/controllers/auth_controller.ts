import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import { IUser, UserModel } from "../models/user_model";
import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";

export class AuthController extends BaseController<IUser> {
    constructor() {
        super(UserModel);
    }

    async login({ body: credentials }: Request, response: Response) {
        const { email, password } = credentials

        if (!(email && password)) {
            console.error('invalid credentials');
            response.status(StatusCodes.UNAUTHORIZED).send()
            return
        }

        try {
            const user = await this.model.findOne({ email })

            if (!user) {
                console.error('user does not exist');
                response.status(StatusCodes.UNAUTHORIZED).send()
                return
            }

            const passwordMatch = await compare(password, user.password)
            if (!passwordMatch) {
                console.error('passwords are not matching');
                response.status(StatusCodes.UNAUTHORIZED).send()
                return
            }

            response.send({ id: user._id })
        } catch (error) {
            console.error('passwords are not matching');
            response.status(StatusCodes.UNAUTHORIZED)
            return
        }
    }

    async logout(request: Request, response: Response) {
        response.send('aaa')
    }
}