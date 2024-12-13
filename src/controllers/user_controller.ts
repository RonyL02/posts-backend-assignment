import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'
import { UserModel } from "../models/user_model";

const getAllUsers = async (request: Request, response: Response) => {
    const { username, email } = request.query

    try {
        const users = await UserModel.find({
            ...(username ? { username } : {}),
            ...(email ? { email } : {})
        })

        response.send(users)
    } catch (error) {
        console.error(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}


const getUserById = async (request: Request, response: Response) => {
    const { id } = request.params

    try {
        const user = await UserModel.findById(id);

        if (user) {
            response.send(user)
        } else {
            response.status(StatusCodes.NOT_FOUND).send()
        }
    } catch (error) {
        console.error(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

const createUser = async (request: Request, response: Response) => {
    const newUser = request.body

    //TODO: encrypt password
    try {
        const { _id: newUserId } = await UserModel.create(newUser)

        response.status(StatusCodes.CREATED).send({ newUserId })
    } catch (error) {
        console.error(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

const updateUser = async (request: Request, response: Response) => {
    const updatedUser = request.body
    const { id } = request.params
    try {
        await UserModel.findByIdAndUpdate(id, updatedUser)

        response.send()
    } catch (error) {
        console.error(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

const deleteUser = async (request: Request, response: Response) => {
    const { id } = request.params

    try {
        await UserModel.findByIdAndDelete(id);

        response.send()
    } catch (error) {
        console.error(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser }