import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../image/logologin.png';


const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${currentUserId}`);
        setProfile(response.data.profile);
      } catch (error) {
        toast.error('Error fetching profile data');
      }
    };

    fetchProfile();
  }, [currentUserId]);

  if (!profile) return <p className="loading">Loading...</p>;

  return (
    <div className="ProfilePage">
      <ToastContainer />
      <div className="ProfilePage__container glass-effect">
        {/* Profile Header Section */}
        <div className="ProfilePage__header">
          <img
            src={profile.profileImage || logo}
            alt="Profile"
            className="ProfilePage__avatar"
            onError={(e) => (e.target.src = logo)}
          />
          <div className="ProfilePage__details">
            <h1 className="ProfilePage__username">{profile.name}</h1>
            <p className="ProfilePage__bio">{profile.bio || 'No bio available'}</p>
            <div className="ProfilePage__stats">
              <div className="ProfilePage__stat">
                <span className="ProfilePage__statCount">{profile.posts}</span>
                <span className="ProfilePage__statLabel">Posts</span>
              </div>
              <div className="ProfilePage__stat">
                <span className="ProfilePage__statCount">{profile.followers}</span>
                <span className="ProfilePage__statLabel">Followers</span>
              </div>
              <div className="ProfilePage__stat">
                <span className="ProfilePage__statCount">{profile.following}</span>
                <span className="ProfilePage__statLabel">Following</span>
              </div>
            </div>
            <p className="ProfilePage__email" style={{color:'black'}}>Email: {profile.email}</p>
            <p className="ProfilePage__gender" style={{color:'black'}}>Gender: {profile.gender || 'Not specified'}</p>
          </div>
        </div>

        <hr className="ProfilePage__divider" />

        {/* Posts Section */}
        <div className="ProfilePage__posts">
          {profile.postsData.map((post, index) => (
            <div className="ProfilePage__post" key={post._id || index}>
              <img
                src={`http://localhost:8000/${post.image}`}
                alt={`Post ${index + 1}`}
                onError={(e) => (e.target.src = logo)}
                className="ProfilePage__postImage"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
