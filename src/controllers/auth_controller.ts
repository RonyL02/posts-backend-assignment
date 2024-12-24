import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import { IUser, UserModel } from "../models/user_model";
import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";
import { sign, verify } from 'jsonwebtoken'
import { Payload } from "../types";
export class AuthController extends BaseController<IUser> {
    constructor() {
        super(UserModel);
    }

    async login(request: Request, response: Response) {
        const { email, password } = request.body

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

            const payload = { _id: user._id }

            const accessToken = sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: process.env.JWT_TOKEN_EXPIRATION })

            const refreshToken = sign(
                payload,
                process.env.REFRESH_TOKEN_SECRET!
            )

            const updatedTokens = user.tokens === null ? [refreshToken] : [...user.tokens, refreshToken]

            await this.model.findByIdAndUpdate(user._id, {
                tokens: updatedTokens
            })

            response.send({ accessToken, refreshToken })
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.UNAUTHORIZED).send()
            return
        }
    }

    async logout(request: Request, response: Response) {
        const authHeader = request.headers.authorization
        const token = authHeader?.split(' ')[1]

        if (!token) {
            response.status(StatusCodes.FORBIDDEN).send()
            return
        }

        try {
            const { _id: userId } = verify(token, process.env.REFRESH_TOKEN_SECRET!) as Payload

            const user = await this.model.findById(userId)

            if (!user) {
                response.status(StatusCodes.FORBIDDEN).send()
                return
            }

            if (!user.tokens.includes(token)) {
                await this.model.findByIdAndUpdate(user._id, {
                    tokens: []
                })

                response.status(StatusCodes.FORBIDDEN).send()
                return
            }

            const tokensWithoutCurrentRefreshToken = user.tokens.filter(t => t !== token)

            await this.model.findByIdAndUpdate(user._id, {
                tokens: tokensWithoutCurrentRefreshToken
            })

            response.send()
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.FORBIDDEN)
        }
    }

    async refreshToken(request: Request, response: Response) {
        const authHeader = request.headers.authorization
        const token = authHeader?.split(' ')[1]

        if (!token) {
            response.status(StatusCodes.FORBIDDEN).send()
            return
        }

        try {
            const { _id: userId } = verify(token, process.env.REFRESH_TOKEN_SECRET!) as Payload
            const user = await this.model.findById(userId)

            if (!user) {
                response.status(StatusCodes.FORBIDDEN).send()
                return
            }

            if (!user.tokens.includes(token)) {
                await this.model.findByIdAndUpdate(user._id, {
                    tokens: []
                })

                response.status(StatusCodes.FORBIDDEN).send()
                return
            }

            const payload = { _id: userId }
            const accessToken = sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: process.env.JWT_TOKEN_EXPIRATION })
            const refreshToken = sign(
                payload,
                process.env.REFRESH_TOKEN_SECRET!
            )

            const tokensWithoutCurrentRefreshToken = user.tokens.filter(t => t !== token)

            await this.model.findByIdAndUpdate(user._id, {
                tokens: [...tokensWithoutCurrentRefreshToken, refreshToken]
            })

            response.send({ accessToken, refreshToken })
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.FORBIDDEN)
        }
    }
}