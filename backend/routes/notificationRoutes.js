const router = require("express").Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  markAllAsRead,
  getUnreadCount} = require("../controller/notificationController")

const authMiddleware = require("../middleware/authMiddleware");

// Get all notifications
router.get("/", authMiddleware, getNotifications);
// Get unread count (must be before /:id)
router.get("/unread-count", authMiddleware, getUnreadCount);

// Mark all as read (must be before /:id)
router.put("/mark-all-read", authMiddleware, markAllAsRead);

// Mark single as read
router.put("/:id", authMiddleware, markAsRead);

// Delete all notifications (must be before /:id)
router.delete("/all", authMiddleware, deleteAllNotifications);

// Delete single notification
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
