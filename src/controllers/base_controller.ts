import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Model } from "mongoose";

export abstract class BaseController<T> {
    constructor(private readonly model: Model<T>) { }

    async find({ query }: Request, response: Response) {
        try {
            const items = await this.model.find(query as object);
            response.send(items);
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        }
    }

    async findById({ params: { id } }: Request, response: Response) {
        try {
            const item = await this.model.findById(id);
            if (item) {
                response.send(item);
            } else {
                response.status(StatusCodes.NOT_FOUND).send();
            }
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        }
    }

    async create({ body: newItem }: Request, response: Response) {
        try {
            const { _id: newId } = await this.model.create(newItem);
            response.status(StatusCodes.CREATED).send({ newId });
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        }
    }

    async update({ body: updatedItemData, params: { id } }: Request, response: Response) {
        try {
            const updatedItem = await this.model.findByIdAndUpdate(id, updatedItemData);

            if (updatedItem) {
                response.send();
            } else {
                response.status(StatusCodes.NOT_FOUND).send();
            }
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        }
    }

    async delete({ params: { id } }: Request, response: Response) {
        try {
            const deltedItem = await this.model.findByIdAndDelete(id)

            if (deltedItem) {
                response.send();
            } else {
                response.status(StatusCodes.NOT_FOUND).send();
            }
        } catch (error) {
            console.error(error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        }
    }
}