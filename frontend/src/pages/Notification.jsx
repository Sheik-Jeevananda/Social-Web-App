import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../components/Loader"
import {
  FaHeart, FaComment, FaUserPlus, FaBell
} from "react-icons/fa";

const getNotificationIcon = (type) => {
  switch (type) {
    case "like":    return <FaHeart className="text-red-500" />;
    case "comment": return <FaComment className="text-blue-500" />;
    case "follow":  return <FaUserPlus className="text-green-500" />;
    default:        return <FaBell className="text-gray-500" />;
  }
};

const getNotificationText = (type) => {
  switch (type) {
    case "like":    return "liked your post";
    case "comment": return "commented on your post";
    case "follow":  return "started following you";
    default:        return "sent you a notification";
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data);
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);

      // Mark all as read after fetching
      if (unread > 0) {
        await API.put("/notifications/mark-all-read");
      }
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await API.delete("/notifications/all");
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-blue-500 mt-0.5">
              {unreadCount} new notifications
            </p>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FaBell className="text-5xl mx-auto mb-3 text-gray-300" />
          <p className="font-semibold">No notifications yet</p>
          <p className="text-sm mt-1">
            When someone likes or comments on your post, you'll see it here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 transition
                ${!notification.read ? "border-l-4 border-blue-400" : ""}
              `}
            >
              {/* Sender Avatar */}
              <Link to={`/profile/${notification.sender._id}`}>
                <img
                  src={
                    notification.sender.avatar ||
                    "https://via.placeholder.com/40"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getNotificationIcon(notification.type)}
                  <p className="text-sm text-gray-700">
                    <Link
                      to={`/profile/${notification.sender._id}`}
                      className="font-semibold hover:underline"
                    >
                      {notification.sender.username}
                    </Link>{" "}
                    {getNotificationText(notification.type)}
                  </p>
                </div>

                {/* Post preview if exists */}
                {notification.post && notification.post.content && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    "{notification.post.content}"
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(notification._id)}
                className="text-gray-300 hover:text-red-400 text-xs transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Notifications;