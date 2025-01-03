import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import { IUser, UserModel } from "../models/user_model";
import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";
import { sign, verify } from 'jsonwebtoken'
import { Payload } from "../types";
import { sendError } from "../utils";
export class AuthController extends BaseController<IUser> {
    constructor() {
        super(UserModel);
    }

    async login(request: Request, response: Response) {
        const { email, password } = request.body

        if (!(email && password)) {
            return sendError(response, StatusCodes.BAD_REQUEST, 'invalid credentials');
        }

        try {
            const user = await this.model.findOne({ email });

            if (!user) {
                return sendError(response, StatusCodes.BAD_REQUEST, 'user does not exist');
            }

            const passwordMatch = await compare(password, user.password);
            if (!passwordMatch) {
                return sendError(response, StatusCodes.BAD_REQUEST, 'passwords are not matching');
            }

            const payload = { _id: user._id }
            const { accessToken, refreshToken } = this.generateTokens(payload);
            
            const updatedTokens = user.tokens.length === 0 ? [refreshToken] : [...user.tokens, refreshToken]

            await this.model.findByIdAndUpdate(user._id, {
                tokens: updatedTokens
            })

            response.send({ accessToken, refreshToken, userId: user._id });
        } catch (error) {
            return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, `${error}`);
        }
    }

    async logout(request: Request, response: Response) {
        const authHeader = request.headers.authorization;
        const refreshToken = authHeader?.split(' ')[1];

        if (!refreshToken) {
            return sendError(response, StatusCodes.BAD_REQUEST, 'missing refresh token');
        }

        try {
            const { _id: userId } = <Payload>verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

            const user = await this.model.findById(userId);

            if (!user) {
                return sendError(response, StatusCodes.FORBIDDEN, 'invalid token');
            }

            if (!user.tokens || !user.tokens.includes(refreshToken)) {
                await this.model.findByIdAndUpdate(user._id, {
                    tokens: []
                });

                return sendError(response, StatusCodes.FORBIDDEN, 'invalid token');
            }

            const tokensWithoutCurrentRefreshToken = user.tokens.filter(token => token !== refreshToken);

            await this.model.findByIdAndUpdate(user._id, {
                tokens: tokensWithoutCurrentRefreshToken
            });

            response.send();
        } catch (error) {
            return sendError(response, StatusCodes.FORBIDDEN, `logout error: ${JSON.stringify(error)}`);
        }
    }

    async refreshToken(request: Request, response: Response) {
        const authHeader = request.headers.authorization
        const refreshToken = authHeader?.split(' ')[1]

        if (!refreshToken) {
            return sendError(response, StatusCodes.BAD_REQUEST, 'missing refresh token');
        }

        try {
            const { _id: userId } = <Payload>verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            const user = await this.model.findById(userId);

            if (!user) {
                return sendError(response, StatusCodes.FORBIDDEN, 'invalid token');
            }

            if (!user.tokens.includes(refreshToken)) {
                await this.model.findByIdAndUpdate(user._id, {
                    tokens: []
                })

                return sendError(response, StatusCodes.FORBIDDEN, 'invalid token');
            }

            const payload = { _id: user._id }
            const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(payload);
            const tokensWithoutCurrentRefreshToken = user.tokens.filter(token => token !== refreshToken);

            await this.model.findByIdAndUpdate(user._id, {
                tokens: [...tokensWithoutCurrentRefreshToken, newRefreshToken]
            });

            response.send({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            return sendError(response, StatusCodes.FORBIDDEN, `refresh token error: ${JSON.stringify(error)}`);
        }
    }

    private generateTokens(payload: Payload) {
        const random = Math.floor(Math.random() * 1000000);

        const accessToken = sign(
            {
                ...payload,
                random: random
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION });

        const refreshToken = sign(
            {
                _id: payload,
                random: random
            },
            process.env.REFRESH_TOKEN_SECRET!);

        return { accessToken, refreshToken };
    }
}