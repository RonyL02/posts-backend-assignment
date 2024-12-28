import request from 'supertest'
import { Express } from 'express'
import { initApp } from '../app';
import { PostModel } from '../models/post_model';
import { CommentModel } from '../models/comment_model';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { IUser, UserModel } from '../models/user_model';

let app: Express;

type UserInfo = IUser & { accessToken?: string, refreshToken?: string }

const user: UserInfo = {
  username: "aaa",
  password: "sdffssdf",
  email: "aaa@dfg.fgd",
}

const createUser = async () => {
  const { body: { newId } } = await request(app).post('/users').send(user)
  user._id = newId
}

beforeAll(async () => {
  app = await initApp()
  await PostModel.deleteMany()
  await CommentModel.deleteMany()
  await UserModel.deleteMany()
})

afterAll(async () => {
  console.log("After all tests");
  await UserModel.deleteMany()
  await PostModel.deleteMany()
  await CommentModel.deleteMany()
  await mongoose.connection.close();
});

describe("Auth Tests", () => {
  test("Auth Registration", async () => {
    const response = await request(app).post("/users").send(user);
    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  test("Auth Registration fail", async () => {
    const response = await request(app).post("/users").send(user);
    expect(response.statusCode).toBe(StatusCodes.CONFLICT);
  });

  test("Auth Login", async () => {
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password
    });
    expect(response.statusCode).toBe(StatusCodes.OK);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    const userId = response.body.userId;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(userId).toBeDefined();
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user._id = userId;
  });

  test("Make sure two access tokens are not the same", async () => {
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password
    });
    expect(response.body.accessToken).not.toBe(user.accessToken);
  });

  test("Get protected API", async () => {
    const unauthenticatedResponse = await request(app).post("/posts").send({
      title: "My First post",
      content: "This is my first post",
    });
    expect(unauthenticatedResponse.statusCode).not.toBe(StatusCodes.CREATED);
    const authenticatedResponse = await request(app).post("/posts").set({
      authorization: `jwt ${user.accessToken}`
    }).send({
      title: "My First post",
      content: "This is my first post",
    });
    expect(authenticatedResponse.statusCode).toBe(StatusCodes.CREATED);
  });

  // test("Get protected API invalid token", async () => {
  //   const response = await request(app).post("/posts").set({
  //     authorization: `jwt ${user.accessToken}1`
  //   }).send({
  //     title: "My First post",
  //     content: "This is my first post",
  //   });
  //   expect(response.statusCode).not.toBe(StatusCodes.CREATED);
  // });

  // test("Refresh Token", async () => {
  //   const response = await request(app).post("/auth/refresh").send({
  //     refreshToken: user.refreshToken
  //   });
  //   expect(response.statusCode).toBe(StatusCodes.OK);
  //   expect(response.body.accessToken).toBeDefined();
  //   expect(response.body.refreshToken).toBeDefined();
  //   user.accessToken = response.body.accessToken;
  //   user.refreshToken = response.body.refreshToken;
  // });

  // test("Logout - invalidate refresh token", async () => {
  //   const response = await request(app).post("/auth/logout")
  //   .set('Authorization', `JWT ${user.refreshToken}`);
  //   expect(response.statusCode).toBe(StatusCodes.OK);

  //   const responseForRefreshAfterLogout = await request(app).post("/auth/refresh")
  //   .set('Authorization', `JWT ${user.refreshToken}`);

  //   expect(responseForRefreshAfterLogout.statusCode).not.toBe(StatusCodes.OK);
  // });

  // test("Refresh token multiuple usage", async () => {
  //   const loginResponse = await request(app).post("/auth/login")
  //   .send({
  //     email: user.email,
  //     password: user.password
  //   });
  //   expect(loginResponse.statusCode).toBe(StatusCodes.OK);
  //   expect(loginResponse.body.accessToken).toBeDefined();
  //   expect(loginResponse.body.refreshToken).toBeDefined();
  //   user.accessToken = loginResponse.body.accessToken;
  //   user.refreshToken = loginResponse.body.refreshToken;

  //   const refreshWithValidTokenResponse = await request(app).post("/auth/refresh")
  //   .set('Authorization', `JWT ${user.refreshToken}`);
    
  //   expect(refreshWithValidTokenResponse.statusCode).toBe(StatusCodes.OK);
  //   const newRefreshToken = refreshWithValidTokenResponse.body.refreshToken;

  //   const refreshWithInvalidatedTokenResponse = await request(app).post("/auth/refresh")
  //   .set('Authorization', `JWT ${user.refreshToken}`);
    
  //   expect(refreshWithInvalidatedTokenResponse.statusCode).not.toBe(StatusCodes.OK);

  //   const refreshWithValidTokenAfterFailResponse = await request(app).post("/auth/refresh")
  //   .set('Authorization', `JWT ${newRefreshToken}`);
    
  //   expect(refreshWithValidTokenAfterFailResponse.statusCode).not.toBe(StatusCodes.OK);
  // });

  // jest.setTimeout(10000);

  // test("timeout on refresh access token", async () => {
  //   const loginResponse = await request(app).post("/auth/login").send({
  //     email: user.email,
  //     password: user.password
  //   });
  //   expect(loginResponse.statusCode).toBe(StatusCodes.OK);
  //   expect(loginResponse.body.accessToken).toBeDefined();
  //   expect(loginResponse.body.refreshToken).toBeDefined();
  //   user.accessToken = loginResponse.body.accessToken;
  //   user.refreshToken = loginResponse.body.refreshToken;

  //   await new Promise(resolve => setTimeout(resolve, 6000));

  //   const createPostResponse = await request(app).post("/posts").set({
  //     authorization: `jwt ${user.accessToken}`
  //   }).send({
  //     title: "My First post",
  //     content: "This is my first post",
  //   });
  //   expect(createPostResponse.statusCode).not.toBe(StatusCodes.CREATED);

  //   const refreshResponse = await request(app).post("/auth/refresh")
  //   .set('Authorization', `JWT ${user.refreshToken}`);
    
  //   expect(refreshResponse.statusCode).toBe(StatusCodes.OK);
  //   user.accessToken = refreshResponse.body.accessToken;
  //   user.refreshToken = refreshResponse.body.refreshToken;

  //   const createPostAfterRefreshResponse = await request(app).post("/posts").set({
  //     authorization: `jwt ${user.accessToken}`
  //   }).send({
  //     title: "My First post",
  //     content: "This is my first post",
  //   });
  //   expect(createPostAfterRefreshResponse.statusCode).toBe(StatusCodes.OK);
  // });

});