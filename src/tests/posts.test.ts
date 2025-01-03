import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import { IPost, PostModel } from "../models/post_model";
import testPostJson from "./test_posts.json";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/user_model";
import { createUser, loginUser } from "./utils";

let app: Express;

type TestPost = Omit<IPost, 'senderId'> & { senderId?: string };

const testPosts: TestPost[] = testPostJson;

const baseUrl = "/posts";

let userId: string | undefined;
const userCredentials = {
  email: "sdfds@dsf.sdf",
  password: "sdfsdfsd"
}
let accessToken: string | undefined;

beforeAll(async () => {
  console.log("Before all tests");
  app = await initApp();
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  userId = await createUser(app, {
    ...userCredentials,
    username: "sdfsdfd"
  })
});

beforeEach(async () => {
  const responseBody = await loginUser(app, userCredentials.email, userCredentials.password)
  accessToken = responseBody.accessToken;
})

afterAll(async () => {
  console.log("After all tests");
  await PostModel.deleteMany()
  await UserModel.deleteMany()
  await mongoose.connection.close();
});

describe("Posts API Tests", () => {
  test("Get all posts when empty", async () => {
    const response = await request(app).get(baseUrl)
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.length).toBe(0);
  });

  test("Create new posts", async () => {
    for (let post of testPosts) {
      const createPostResponse = await request(app).post(baseUrl)
        .set('Authorization', `JWT ${accessToken}`)
        .send(post);

      expect(createPostResponse.statusCode).toBe(StatusCodes.CREATED);
      expect(createPostResponse.body.newId).toBeDefined();

      post._id = createPostResponse.body.newId;
    }
  });

  test("Get all posts", async () => {
    const response = await request(app).get(baseUrl)
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.length).toBe(testPosts.length);

    (response.body as IPost[]).forEach(post => {
      expect(post.senderId).toBe(userId)
    })
  });

  test("Get post by ID", async () => {
    const response = await request(app).get(`${baseUrl}/${testPosts[0]._id}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.title).toBe(testPosts[0].title);
    expect(response.body.content).toBe(testPosts[0].content);
  });

  test("Get post by non existent ID", async () => {
    const nonExistentId = '673924d57453a2741caf84e1'
    const response = await request(app).get(`${baseUrl}/${nonExistentId}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND); 
  });

  test("Update a post", async () => {
    const updatedData = { title: "Updated Title", content: "Updated Content" };
    const response = await request(app)
      .put(`${baseUrl}/${testPosts[0]._id}`)
      .set('Authorization', `JWT ${accessToken}`)
      .send(updatedData);
    expect(response.statusCode).toBe(StatusCodes.OK);

    const responseGet = await request(app).get(`${baseUrl}/${testPosts[0]._id}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(responseGet.body.title).toBe(updatedData.title);
    expect(responseGet.body.content).toBe(updatedData.content);
  });

  test("Update post by non existent ID", async () => {
    const nonExistentId = '673924d57453a2741caf84e1'
    const response = await request(app).put(`${baseUrl}/${nonExistentId}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND); 
  });
  
  test("Try to create invalid post", async () => {
    const invalidPost = { author: "UserWithoutTitle" };
    const response = await request(app).post(baseUrl)
      .set('Authorization', `JWT ${accessToken}`)
      .send(invalidPost);
    expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
