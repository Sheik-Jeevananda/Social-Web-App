import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPost } from "../redux/slices/postSlice";
import API from "../api/axios";
import toast from "react-hot-toast";

const CreatePost = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return toast.error("Post cannot be empty");
    }

    setLoading(true);
    try {
      const { data } = await API.post("/posts", { content });
      dispatch(addPost(data.post));
      toast.success("Post created!");
      setContent("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <img
          src={user?.avatar || "https://via.placeholder.com/40"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Input */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            className="w-full resize-none border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-1.5 rounded-full transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
