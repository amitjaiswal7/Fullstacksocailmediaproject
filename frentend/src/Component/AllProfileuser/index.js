import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../image/logologin.png";

const AllUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const { userId } = useParams();
  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
  const BASE_URL = "https://fullstacksocailmediaproject.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/alluser/profile/${userId}`);
        const profileData = response.data.profile;

        setProfile(profileData);
        setIsFollowing(profileData.followers.includes(currentUserId));
      } catch (error) {
        toast.error("Error fetching profile data");
      }
    };

    fetchProfile();
  }, [userId, currentUserId]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/suggested?page=${page}&limit=10&currentUserId=${currentUserId}`
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, [page, currentUserId]);

  const handleFollow = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/follow/${id}`, { userId: currentUserId });
      toast.success("Followed successfully!");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user.");
    }
  };

  const handleUnfollow = async (id) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/unfollow/${id}`, { userId: currentUserId });
      toast.success(response.data.message || "Unfollowed successfully!");
      if (id === userId) {
        setIsFollowing(false);
        setProfile((prev) => ({
          ...prev,
          followers: prev.followers.filter((followerId) => followerId !== currentUserId),
        }));
      } else {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isFollowed: false } : u)));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Failed to unfollow user.");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="AllProfileusers__container">
      <ToastContainer />
      <div className="AllProfileusers__header">
        <div className="AllProfileusers__image">
          <img
            src={profile.profileImage || logo}
            alt={`${profile.name}'s Profile`}
            onError={(e) => (e.target.src = logo)}
          />
        </div>
        <div className="AllProfileusers__details">
          <h1 className="AllProfileusers__username">{profile.name}</h1>
          <div className="AllProfileusers__stats">
            <div className="AllProfileusers__stat">
              <span className="AllProfileusers__statCount">{profile.posts}</span>
              <span className="AllProfileusers__statLabel">Posts</span>
            </div>
            <div className="AllProfileusers__stat">
              <span className="AllProfileusers__statCount">{profile.followers.length}</span>
              <span className="AllProfileusers__statLabel">Followers</span>
            </div>
            <div className="AllProfileusers__stat">
              <span className="AllProfileusers__statCount">{profile.following}</span>
              <span className="AllProfileusers__statLabel">Following</span>
            </div>
          </div>
          <p className="AllProfileusers__bio">{profile.bio || "No bio available"}</p>
        </div>
        {currentUserId !== userId && (
          <div className="AllProfileusers__actions">
            {isFollowing ? (
              <button
                onClick={() => handleUnfollow(userId)}
                className="AllProfileusers__followButton following"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleFollow(userId)}
                className="AllProfileusers__followButton"
              >
                Follow
              </button>
            )}
          </div>
        )}
      </div>
      <hr />
      <div className="AllProfileusers__posts">
        {profile.postsData?.length > 0 ? (
          profile.postsData.map((post, index) => (
            <div className="AllProfileusers__post" key={post._id || index}>
              <img
                src={`http://localhost:8000/${post.image}`}
                alt={`Post ${index + 1}`}
                onError={(e) => (e.target.src = logo)}
              />
            </div>
          ))
        ) : (
          <p className="AllProfileusers__noPosts">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default AllUserProfile;
