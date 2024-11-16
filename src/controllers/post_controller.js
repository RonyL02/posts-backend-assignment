const { response } = require("express");
const postModel = require("../models/posts_model");

const getAllPosts = async (request, response) => {
  const sender = request.query.sender;
  let posts = [];
  try {
    if (sender) {
      posts = await postModel.find({ senderId: sender });
    } else {
      posts = await postModel.find();
    }
    response.send(posts);
  } catch (error) {
    console.error(error.message);
    response.status(500).send();
  }
};

const getPostById = async (request, response) => {
  const id = request.params.id;
  try {
    post = await postModel.findById(id);
    response.send(post);
  } catch (error) {
    console.error(error.message);
    response.status(500).send();
  }
};

const createPost = async (request, response) => {
  const body = request.body;
  try {
    const {_id}= await postModel.create(body);
    response.send(_id);
  } catch (error) {
    console.error(error.message);
    response.status(500).send();
  }
};

const updatePost = async(request, response) => {
    const id = request.params.id;
    const body= request.body;
  try {
    await postModel.findByIdAndUpdate(id,body);
    response.send();
  } catch (error) {
    console.error(error.message);
    response.status(500).send();
    
  }
  };
  module.exports = {getAllPosts,getPostById,createPost,updatePost};
