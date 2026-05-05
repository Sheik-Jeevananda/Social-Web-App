import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExplorePosts } from "../redux/slices/postSlice";
import API from "../api/axios";
import toast from "react-hot-toast";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Explore = () => {
  const dispatch = useDispatch();
  const { explorePosts } = useSelector((state) => state.post);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchExplorePosts = async () => {
    try {
      const { data } = await API.get("/posts/explore");
      dispatch(setExplorePosts(data));
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const { data } = await API.get(`/users/search?query=${searchQuery}`);
      setSearchResults(data);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">

      {/* Search Bar */}
      <div className="relative mb-5">
        <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 px-4 py-2 gap-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="flex-1 text-sm focus:outline-none bg-transparent"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 overflow-hidden">
            {searching ? (
              <div className="p-4 text-center text-sm text-gray-400">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No users found
              </div>
            ) : (
              searchResults.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u._id}`}
                  onClick={clearSearch}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                >
                  <img
                    src={u.avatar || "https://via.placeholder.com/36"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {u.username}
                    </p>
                    <p className="text-xs text-gray-400">
                      {u.bio || "No bio"}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 bg-white rounded-t-2xl">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 text-sm font-semibold transition
            ${activeTab === "posts"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Explore Posts
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-3 text-sm font-semibold transition
            ${activeTab === "users"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Find People
        </button>
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <>
          {loading ? (
            <Loader />
          ) : explorePosts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold">No posts to explore</p>
            </div>
          ) : (
            explorePosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <UsersList />
      )}

    </div>
  );
};

// Users List Component
const UsersList = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users/search?query=");
      // Filter out current user
      const filtered = data.filter((u) => u._id !== user._id);
      setUsers(filtered);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await API.post(`/users/${userId}/follow`);
      setFollowing((prev) => ({
        ...prev,
        [userId]: !prev[userId],
      }));
    } catch (err) {
      toast.error("Failed to follow");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-semibold">No users found</p>
        </div>
      ) : (
        users.map((u) => (
          <div
            key={u._id}
            className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3"
          >
            <Link to={`/profile/${u._id}`}>
              <img
                src={u.avatar || "https://via.placeholder.com/44"}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover"
              />
            </Link>
            <div className="flex-1">
              <Link to={`/profile/${u._id}`}>
                <p className="font-semibold text-sm text-gray-800 hover:underline">
                  {u.username}
                </p>
              </Link>
              <p className="text-xs text-gray-400 truncate">
                {u.bio || "No bio"}
              </p>
            </div>
            <button
              onClick={() => handleFollow(u._id)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition
                ${following[u._id]
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              {following[u._id] ? "Following" : "Follow"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Explore;