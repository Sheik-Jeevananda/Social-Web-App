import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const CommentSection = ({ postId }) => {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/${postId}`);
      setComments(data);
    } catch (err) {
      toast.error("Failed to load comments");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.post(`/comments/${postId}`, { text });
      setComments([data.comment, ...comments]);
      setText("");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">

      {/* Add Comment */}
      <form onSubmit={handleAddComment} className="flex gap-2 mb-3">
        <img
          src={user?.avatar || "https://via.placeholder.com/32"}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full disabled:opacity-50"
          >
            {loading ? "..." : "Post"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center">
            No comments yet. Be the first!
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-2 items-start">
            <Link to={`/profile/${comment.author._id}`}>
              <img
                src={comment.author.avatar || "https://via.placeholder.com/32"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
              <div className="flex justify-between items-center">
                <Link
                  to={`/profile/${comment.author._id}`}
                  className="text-sm font-semibold text-gray-800 hover:underline"
                >
                  {comment.author.username}
                </Link>
                {comment.author._id === user._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CommentSection;