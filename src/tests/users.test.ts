import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import testUsersJson from "./test_users.json";
import { StatusCodes } from "http-status-codes";
import { IUser, UserModel } from "../models/user_model";

let app: Express;

export type TestUser = Omit<IUser, 'tokens'> & { tokens?: string[] };

const testUsers: TestUser[] = testUsersJson;

const baseUrl = "/users";

beforeAll(async () => {
    console.log("Before all tests");
    app = await initApp();
    await UserModel.deleteMany();
});

afterAll(async () => {
    console.log("After all tests");
    await mongoose.connection.close();
});

describe("Users API Tests", () => {
    test("Get all users when empty", async () => {
        const response = await request(app).get(baseUrl);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.length).toBe(0);
    });

    test("Create new users", async () => {
        for (let user of testUsers) {
            const createUserResponse = await request(app).post(baseUrl)
                .send(user);

            expect(createUserResponse.statusCode).toBe(StatusCodes.CREATED);
            expect(createUserResponse.body.newId).toBeDefined();

            user._id = createUserResponse.body.newId;
        }
    });

    test("Get all users", async () => {
        const response = await request(app).get(baseUrl);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.length).toBe(testUsers.length);
    });

    test("Get user by ID", async () => {
        const response = await request(app).get(`${baseUrl}/${testUsers[0]._id}`);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.username).toBe(testUsers[0].username);
    });

    test("Update a user", async () => {
        const updatedData = { username: "new username" };
        const response = await request(app)
            .put(`${baseUrl}/${testUsers[0]._id}`)
            .send(updatedData);
        expect(response.statusCode).toBe(StatusCodes.OK);

        const responseGet = await request(app).get(`${baseUrl}/${testUsers[0]._id}`);

        expect(responseGet.body.username).toBe(updatedData.username);
    });

    test("Delete a user", async () => {
        const response = await request(app).delete(`${baseUrl}/${testUsers[0]._id}`);

        expect(response.statusCode).toBe(StatusCodes.OK);

        const responseGet = await request(app).get(`${baseUrl}/${testUsers[0]._id}`);

        expect(responseGet.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test("Try to create invalid user", async () => {
        const invalidUser = { author: "UserWithoutTitle" };
        const response = await request(app).post(baseUrl)
            .send(invalidUser);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});
