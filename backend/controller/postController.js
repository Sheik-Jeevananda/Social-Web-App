const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/comment");
const createNotification = require("../utils/createNotification");



const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username avatar"
    );

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFeed = async (req, res) => {
   try {
    const currentUser = await User.findById(req.user.id);

    const posts = await Post.find({
      author: { $in: [...currentUser.following, req.user.id] },
    })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}  


const getPost = async (req, res) => {
     try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getUserPosts = async (req, res) => {
   try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}  


const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      post.likes.pull(req.user.id);
      await post.save();
      res.status(200).json({ message: "Post unliked", likes: post.likes });
    } else {
      post.likes.push(req.user.id);
      await createNotification(post.author, req.user.id, "like", post._id);
      await post.save();
      res.status(200).json({ message: "Post liked", likes: post.likes });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author can delete
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    // Delete all comments of this post
    await Comment.deleteMany({ post: req.params.id });

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const explorePosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .limit(50);

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createPost,
  getFeed,
  getPost,
  getUserPosts,
  likePost,
  deletePost,
  explorePosts,
};