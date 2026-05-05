import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";
import API from "../api/axios";
import toast from "react-hot-toast";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import EditProfileModal from "../components/EditProfileModel";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";

const Profile = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const isOwner = user._id === id;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setProfile(data);
      setFollowing(data.followers.some((f) => f._id === user._id));
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data } = await API.get(`/posts/user/${id}`);
      setPosts(data);
    } catch (err) {
      toast.error("Failed to load posts");
    }
  };

  const handleFollow = async () => {
    try {
      await API.post(`/users/${id}/follow`);
      setFollowing(!following);
      setProfile((prev) => ({
        ...prev,
        followers: following
          ? prev.followers.filter((f) => f._id !== user._id)
          : [...prev.followers, { _id: user._id }],
      }));
    } catch (err) {
      toast.error("Failed to follow user");
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setProfile((prev) => ({ ...prev, ...updatedUser }));
    dispatch(updateUser(updatedUser));
    setShowEditModal(false);
    toast.success("Profile updated!");
  };

  if (loading) return <Loader />;
  if (!profile) return (
    <div className="text-center py-20 text-gray-400">User not found</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">

        {/* Avatar + Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

          {/* Avatar */}
          <img
            src={profile.avatar || "https://via.placeholder.com/100"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-800">
              {profile.username}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {profile.bio || "No bio yet"}
            </p>

            {/* Stats */}
            <div className="flex justify-center sm:justify-start gap-6 mt-4">
              <div className="text-center">
                <p className="font-bold text-gray-800">{posts.length}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">
                  {profile.followers.length}
                </p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">
                  {profile.following.length}
                </p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3 justify-center sm:justify-start">
          {isOwner ? (
            <button
              onClick={() => setShowEditModal(true)}
              className="px-6 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition
                ${following
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {following ? <><FaUserCheck /> Following</> : <><FaUserPlus /> Follow</>}
            </button>
          )}
        </div>
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
          Posts
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 py-3 text-sm font-semibold transition
            ${activeTab === "followers"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Followers
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-3 text-sm font-semibold transition
            ${activeTab === "following"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Following
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" && (
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📷</p>
              <p className="font-semibold">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      )}

      {activeTab === "followers" && (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          {profile.followers.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No followers yet</p>
          ) : (
            profile.followers.map((follower) => (
              <div key={follower._id} className="flex items-center gap-3">
                <img
                  src={follower.avatar || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-medium text-sm text-gray-800">
                  {follower.username}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          {profile.following.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Not following anyone</p>
          ) : (
            profile.following.map((followed) => (
              <div key={followed._id} className="flex items-center gap-3">
                <img
                  src={followed.avatar || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-medium text-sm text-gray-800">
                  {followed.username}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

    </div>
  );
};

export default Profile;