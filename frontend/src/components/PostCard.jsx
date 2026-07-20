import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLike, removePost } from "../redux/slices/postSlice";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaTrash,
  FaEllipsisH,
} from "react-icons/fa";

const PostCard = ({ post }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = user ? post.likes.includes(user._id) : false;
  const isOwner = user ? post.author._id === user._id : false;

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      await API.put(`/posts/${post._id}/like`);
      dispatch(toggleLike({ postId: post._id, userId: user._id }));
    } catch (err) {
      toast.error("Failed to like post");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post._id}`);
      dispatch(removePost(post._id));
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <Link
          to={`/profile/${post.author._id}`}
          className="flex items-center gap-2"
        >
          <img
            src={post.author.avatar || "👥"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {post.author.username}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>

        {/* Options Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FaEllipsisH />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full rounded-xl"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-sm text-gray-700 mb-3">{post.content}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5 border-t border-gray-100 pt-3">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition
            ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{post.likes.length}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition"
        >
          <FaComment />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && <CommentSection postId={post._id} />}
    </div>
  );
};

export default PostCard;
