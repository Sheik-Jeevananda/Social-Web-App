const router = require("express").Router();

const { getUserProfile, editProfile, changePassword, followUser, getFollowers, getFollowing, searchUsers } = require("../controller/userController");

const authMiddleware = require("../middleware/authMiddleware");

// Search users (must be before /:id)
router.get("/search", authMiddleware, searchUsers);

// Edit profile (must be before /:id)
router.put("/edit", authMiddleware, editProfile);

// Change password (must be before /:id)
router.put("/change-password", authMiddleware, changePassword);

// Get user profile
router.get("/:id", authMiddleware, getUserProfile);

// Follow / Unfollow
router.post("/:id/follow", authMiddleware, followUser);

// Get followers
router.get("/:id/followers", authMiddleware, getFollowers);

// Get following
router.get("/:id/following", authMiddleware, getFollowing);

module.exports = router;
