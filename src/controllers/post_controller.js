const postModel = require("../models/posts_model");

const getAllPosts = async (request, response) => {
  const senderFilter = request.query.sender;

  try {
    const posts = await postModel.find(senderFilter ? { senderId: senderFilter } : {});
    response.send(posts);
  } catch (error) {
    console.error(error.message);
    response.status(400).send();
  }
};

const getPostById = async (request, response) => {
  const id = request.params.id;

  try {
    post = await postModel.findById(id);

    if (post) {
      response.send(post);
    } else {
      response.status(404).send();
    }
  } catch (error) {
    console.error(error.message);
    response.status(400).send();
  }
};

const createPost = async (request, response) => {
  const newPost = request.body;

  try {
    const { _id: newPostId } = await postModel.create(newPost);
    response.send(newPostId);
  } catch (error) {
    console.error(error.message);
    response.status(400).send();
  }
};

const updatePost = async (request, response) => {
  const id = request.params.id;
  const updatedPost = request.body;

  try {
    await postModel.findByIdAndUpdate(id, updatedPost);
    response.send();
  } catch (error) {
    console.error(error.message);
    response.status(400).send();
  }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost };