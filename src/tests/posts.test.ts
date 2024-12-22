import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import { PostModel } from "../models/post_model";
import  testPostJson  from "./test_posts.json";

type Post = {
    title: string;
    content: string;
    _id?: string;
    senderId: number;

}
let app: Express;
const testPosts:Post[]=testPostJson;

const baseUrl = "/posts";
//const testPosts = require("./test_posts.json");
// נתונים לדוגמה לפוסטים
/*const testPosts: { title: string; content: string; author: string; _id?: string }[] = [
  { title: "First Post",
     content: "This is the first post",
      author: "User1" },

  { title: "Second Post",
     content: "This is the second post",
      author: "User2" },
];*/

beforeAll(async () => {
  console.log("Before all tests");
  app = await initApp();
  await PostModel.deleteMany(); // ננקה את המסד נתונים לפני הריצה
});

afterAll(async () => {
  console.log("After all tests");
  await mongoose.connection.close();
});

describe("Posts API Tests", () => {
  test("Get all posts when empty", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0); // המסד נתונים ריק
  });

  test("Create new posts", async () => {
    for (let post of testPosts) {
        console.log(post);
      const response = await request(app).post(baseUrl).send(post).set('Content-Type', 'application/json');
      expect(response.statusCode).toBe(201); // סטטוס ליצירה מוצלחת
      expect(response.body.newId).toBeDefined();
      post["_id"] = response.body.newId; // שמירת מזהה הפוסט לשימוש עתידי
    }
  });

  test("Get all posts", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(testPosts.length);
  });

  test("Get post by ID", async () => {
    const response = await request(app).get(`${baseUrl}/${testPosts[0]._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testPosts[0].title);
    expect(response.body.content).toBe(testPosts[0].content);
  });

  test("Update a post", async () => {
    const updatedData = { title: "Updated Title", content: "Updated Content" };
    const response = await request(app)
      .put(`${baseUrl}/${testPosts[0]._id}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);

    const responseGet = await request(app).get(`${baseUrl}/${testPosts[0]._id}`);
    expect(responseGet.body.title).toBe(updatedData.title);
    expect(responseGet.body.content).toBe(updatedData.content);
  });

  test("Fail to create invalid post", async () => {
    const invalidPost = { author: "UserWithoutTitle" }; // נתונים לא מלאים
    const response = await request(app).post(baseUrl).send(invalidPost);
    expect(response.statusCode).toBe(500); // בדיקה שהבקשה נדחית
  });
});
