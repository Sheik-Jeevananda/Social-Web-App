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
const upload = require("../middleware/upload");

// Explore
router.get("/explore", authMiddleware, explorePosts);

// Feed
router.get("/feed", authMiddleware, getFeed);

// User posts
router.get("/user/:id", authMiddleware, getUserPosts);

// Create post
router.post("/", authMiddleware, upload.single("image"), createPost);

// Get single post
router.get("/:id", authMiddleware, getPost);

// Like
router.put("/:id/like", authMiddleware, likePost);

// Delete
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;