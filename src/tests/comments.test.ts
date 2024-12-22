import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import { CommentModel, IComment } from "../models/comment_model";
import testCommentJson from "./test_comments.json";



const baseUrl = "/comments";

 type Comment = {
    senderId: number;
    postId: string;
    content: string;
    _id?: string
    //לפעמים חובה לפעמים לא
  }
  
let app: Express;
  const testComments:Comment[]=testCommentJson;

beforeAll(async () => {
  console.log("Before all tests");
  app = await initApp();
  await CommentModel.deleteMany();
});

afterAll(async () => {
  console.log("After all tests");
  await mongoose.connection.close();
});

describe("Comments API Tests", () => {
  test("Get all comments when empty", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Create new comments", async () => {
    for (let comment of testComments) {
      const response = await request(app).post(baseUrl).send(comment);
      expect(response.statusCode).toBe(201);
      expect(response.body.newId).toBeDefined();
        comment._id = response.body.newId;
    }
  });

  
  test("Get all comments", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(testComments.length);
  });

  test("Get comment by ID", async () => {
    const response = await request(app).get(`${baseUrl}/${testComments[0]._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(testComments[0].content);
  });
  
  test("Get comments by post ID", async () => {
    const postId = testComments[0].postId; 
    console.log(`${baseUrl}?postId=${postId}`);
    const response = await request(app).get(`${baseUrl}?postId=${postId}`);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].postId).toBe(postId);
  });

  test("Update a comment", async () => {
    const updatedContent = { content: "Updated content" };
    const response = await request(app)
      .put(`${baseUrl}/${testComments[0]._id}`)
      .send(updatedContent);
    expect(response.statusCode).toBe(200);

    const responseGet = await request(app).get(`${baseUrl}/${testComments[0]._id}`);
    expect(responseGet.body.content).toBe(updatedContent.content);
  });

  test("Delete a comment", async () => {
    const response = await request(app).delete(`${baseUrl}/${testComments[0]._id}`);
    expect(response.statusCode).toBe(200);

    const responseGet = await request(app).get(`${baseUrl}/${testComments[0]._id}`);
    expect(responseGet.statusCode).toBe(404);
  });

  test("Fail to create invalid comment", async () => {
    const invalidComment = { senderId: 3 };
    const response = await request(app).post(baseUrl).send(invalidComment);
    expect(response.statusCode).toBe(500);
  });
  

});