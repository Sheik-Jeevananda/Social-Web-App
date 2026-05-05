import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FaBell } from "react-icons/fa";

const NotificationBadge = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get("/notifications/unread-count");
      setCount(data.unreadCount);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Link to="/notifications" className="relative">
      <FaBell size={20} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadge;