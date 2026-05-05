import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed } from "../redux/slices/postSlice";
import API from "../api/axios";
import toast from "react-hot-toast";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { useState } from "react";

const Feed = () => {
  const dispatch = useDispatch();
  const { feed } = useSelector((state) => state.post);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const { data } = await API.get("/posts/feed");
      dispatch(setFeed(data));
    } catch (err) {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">

      {/* Create Post */}
      <CreatePost />

      {/* Feed */}
      {loading ? (
        <Loader />
      ) : feed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-semibold">Your feed is empty</p>
          <p className="text-sm mt-1">Follow people to see their posts here</p>
        </div>
      ) : (
        feed.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      )}

    </div>
  );
};

export default Feed;