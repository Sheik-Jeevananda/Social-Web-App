const router = require("express").Router();
const {
  createPost,
  getFeed,
  getPost,
  getUserPosts,
  likePost,
  deletePost,
  explorePosts,
} = require("../controller/postController");
const authMiddleware = require("../middleware/authMiddleware");

// Explore (must be before /:id)
router.get("/explore", authMiddleware, explorePosts);

// Feed (must be before /:id)
router.get("/feed", authMiddleware, getFeed);

// Get user posts (must be before /:id)
router.get("/user/:id", authMiddleware, getUserPosts);

// Create post
router.post("/", authMiddleware, createPost);

// Get single post
router.get("/:id", authMiddleware, getPost);

// Like / Unlike
router.put("/:id/like", authMiddleware, likePost);

// Delete post
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
