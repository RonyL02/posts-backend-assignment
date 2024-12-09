import { Request, Response } from 'express';
import postModel from '../models/posts_model';


const getAllPosts = async (request:Request, response:Response) => {
  const senderFilter = request.query.sender;

  try {
    const posts = await postModel.find(senderFilter ? { senderId: senderFilter } : {});
    response.send(posts);
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          if (error instanceof Error) {
            if (error instanceof Error) {
              console.error(error.message);
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
        } else {
          console.error(error);
        }
      } else {
        console.error(error);
      }
    }
    response.status(400).send();
  }
};

const getPostById = async (request:Request, response:Response) => {
  const id = request.params.id;

  try {
    const post = await postModel.findById(id);

    if (post) {
      response.send(post);
    } else {
      response.status(404).send();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    response.status(400).send();
  }
};

const createPost = async (request:Request, response:Response) => {
  const newPost = request.body;

  try {
    const { _id: newPostId } = await postModel.create(newPost);
    response.send(newPostId);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    response.status(400).send();
  }
};

const updatePost = async (request:Request, response:Response) => {
  const id = request.params.id;
  const updatedPost = request.body;

  try {
    await postModel.findByIdAndUpdate(id, updatedPost);
    response.send();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    response.status(400).send();
  }
};
export { getAllPosts, getPostById, createPost, updatePost };
