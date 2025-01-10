import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import testUsersJson from "./test_users.json";
import { StatusCodes } from "http-status-codes";
import { IUser, UserModel } from "../models/user_model";
import { createUser, loginUser } from "./utils";

let app: Express;

export type TestUser = Omit<IUser, 'tokens'> & { tokens?: string[] };

const testUsers: TestUser[] = testUsersJson;

const baseUrl = "/users";
const userCredentials = {
    email: "sdfds@dsf.sdf",
    password: "sdfsdfsd"
};
let accessToken: string | undefined;
let loggedUserId: string | undefined;

beforeAll(async () => {
    console.log("Before all tests");
    app = await initApp();
    await UserModel.deleteMany();
    loggedUserId = await createUser(app, {
        ...userCredentials,
        username: "sdfsdfd"
    });
});

beforeEach(async () => {
    const responseBody = await loginUser(app, userCredentials.email, userCredentials.password)
    accessToken = responseBody.accessToken;
});

afterAll(async () => {
    console.log("After all tests");
    await mongoose.connection.close();
});

describe("Users API Tests", () => {

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
        const response = await request(app).get(baseUrl)
            .set('Authorization', `JWT ${accessToken}`);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.length).toBe(testUsers.length + 1);
    });

    test("Get user by ID", async () => {
        const response = await request(app).get(`${baseUrl}/${testUsers[0]._id}`)
            .set('Authorization', `JWT ${accessToken}`);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.username).toBe(testUsers[0].username);
    });

    test("Get user by non existent ID", async () => {
        const nonExistentId = '673924d57453a2741caf84e1'
        const response = await request(app).get(`${baseUrl}/${nonExistentId}`)
            .set('Authorization', `JWT ${accessToken}`);

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test("Update a user", async () => {
        const newPassword = "1abc";
        const updatedData = { username: "new username", password: newPassword };
        const response = await request(app)
            .put(`${baseUrl}`)
            .set('Authorization', `JWT ${accessToken}`)
            .send(updatedData);
        expect(response.statusCode).toBe(StatusCodes.OK);

        const responseGet = await request(app).get(`${baseUrl}/${loggedUserId}`)
            .set('Authorization', `JWT ${accessToken}`);

        expect(responseGet.body.username).toBe(updatedData.username);

        userCredentials.password = newPassword;

        const responseLogin = await request(app).post("/auth/login").send({
            email: userCredentials.email,
            password: userCredentials.password
        });
        expect(responseLogin.statusCode).toBe(StatusCodes.OK);
        const newAccessToken = responseLogin.body.accessToken;
        expect(newAccessToken).toBeDefined();
    
    });

    test("Delete a user", async () => {        
        const response = await request(app).delete(`${baseUrl}`)
            .set('Authorization', `JWT ${accessToken}`);

        expect(response.statusCode).toBe(StatusCodes.OK);

        const responseGet = await request(app).get(`${baseUrl}/${loggedUserId}`)
            .set('Authorization', `JWT ${accessToken}`);

        expect(responseGet.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test("Try to create invalid user", async () => {
        const invalidUser = { author: "UserWithoutTitle" };
        const response = await request(app).post(baseUrl)
            .send(invalidUser);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});
