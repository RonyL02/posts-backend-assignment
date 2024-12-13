import { Request, Response } from 'express';
import { PostModel } from '../models/posts_model';


const getAllPosts = async (request: Request, response: Response) => {
  const senderId = request.query.sender;

  try {
    const posts = await PostModel.find(senderId ? { senderId } : {});
    response.send(posts);
  } catch (error) {
    console.error(error);

    response.status(500).send();
  }
};

const getPostById = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    const post = await PostModel.findById(id);

    if (post) {
      response.send(post);
    } else {
      response.status(404).send();
    }
  } catch (error) {
    console.error(error);

    response.status(500).send();
  }
};

const createPost = async (request: Request, response: Response) => {
  const newPost = request.body;

  try {
    const { _id: newPostId } = await PostModel.create(newPost);
    response.status(201).send({ newPostId });
  } catch (error) {
    console.error(error);

    response.status(500).send();
  }
};

const updatePost = async (request: Request, response: Response) => {
  const id = request.params.id;
  const updatedPost = request.body;

  try {
    await PostModel.findByIdAndUpdate(id, updatedPost);
    response.send();
  } catch (error) {
    console.error(error);

    response.status(500).send();
  }
};
export { getAllPosts, getPostById, createPost, updatePost };
