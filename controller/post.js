const Post = require("../models/post");

const GetPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
  next();
};

const GetPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
  next();
};

module.exports = {
  GetPostById,
  GetPosts,
};
