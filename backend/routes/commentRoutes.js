const router = require("express").Router();
const {
  addComment,
  getComments,
  likeComment,
  deleteComment,
  editComment
} = require("../controller/commentController");



const authMiddleware = require("../middleware/authMiddleware");


router.post("/:postId", authMiddleware, addComment);

// Get all comments of post
router.get("/:postId", authMiddleware, getComments);

// Like / Unlike comment
router.put("/:commentId/like", authMiddleware, likeComment);

// Edit comment
router.put("/:commentId", authMiddleware, editComment);

// Delete comment
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;

