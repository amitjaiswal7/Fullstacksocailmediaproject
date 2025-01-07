import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const BASE_URL = 'https://fullstacksocailmediaproject.onrender.com/api/allposts';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(BASE_URL);
        setPosts(data);
      } catch (err) {
        toast.error('Failed to load posts. Please try again later.');
      }
    };
    fetchPosts();
  }, []);

  const handleNavigateToProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      toast.error("User ID not found!");
    }
  };

  return (
    <div className="explore-section-container">
      <ToastContainer />
      <div className="explore-section-grid">
        {posts.map((post) => (
          <div key={post._id} className="explore-section-card">
            <div className="explore-section-card-header">
              <img
                src={`${BASE_URL}/${post.userId?.profileImage || ''}`}
                alt="Profile"
                className="explore-section-profile-image"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
              />
              <span
                className="explore-section-profile-name"
                onClick={() => handleNavigateToProfile(post.userId?._id)}
              >
                {post.userId?.name || 'Unknown User'}
              </span>
            </div>
            <div className="explore-section-post-image-container">
              <img
                src={`${BASE_URL}/${post.image || ''}`}
                alt="Post"
                className="explore-section-post-image"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
              />
            </div>
     
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
