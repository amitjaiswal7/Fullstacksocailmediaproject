import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../image/logologin.png';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    pronouns: '',
    bio: '',
    gender: '',
    profileImage: null,
  });

  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/edit-profile/${currentUserId}`);
        const profile = response.data.profile;
        setFormData({
          name: profile.name || '',
          pronouns: profile.pronouns || '',
          bio: profile.bio || '',
          gender: profile.gender || '',
          profileImage: null,
        });
      } catch (err) {
        toast.error('Error fetching profile data');
      }
    };

    fetchProfile();
  }, [currentUserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('pronouns', formData.pronouns);
    updateData.append('bio', formData.bio);
    updateData.append('gender', formData.gender);
    if (formData.profileImage) {
      updateData.append('profileImage', formData.profileImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/edit-profile/${currentUserId}`,
        updateData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="EditProfile-container">
      <ToastContainer />
      <div className="EditProfile-card">
        <h1 className="EditProfile-title" style={{color:'black'}}>Edit Profile</h1>
        <div className="EditProfile-image-container">
          <img
            src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : logo}
            alt="Profile Icon"
            className="EditProfile-profile-image"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="EditProfile-file-input"
          />
        </div>
        <form className="EditProfile-form" onSubmit={handleSubmit}>
          <div className="EditProfile-input-group">
            <label htmlFor="name" style={{color:'black'}}>Name</label>
            <input
              type="text"
              id="name"
              style={{color:'black'}}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="EditProfile-input-group">
            <label htmlFor="pronouns" style={{color:'black'}}>Pronouns</label>
            <input
              type="text"
              style={{color:'black'}}
              id="pronouns"
              name="pronouns"
              value={formData.pronouns}
              onChange={handleInputChange}
              placeholder="e.g., they/them, he/him"
            />
          </div>
          <div className="EditProfile-input-group">
            <label htmlFor="bio" style={{color:'black'}}>Bio</label>
            <textarea
              id="bio"
              style={{color:'black'}}
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="EditProfile-input-group">
            <label htmlFor="gender"style={{color:'black'}}>Gender</label>
            <select
            style={{color:'black'}}
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="" style={{color:'black'}}>Select Gender</option>
              <option value="male" style={{color:'black'}}>Male</option>
              <option value="female" style={{color:'black'}}>Female</option>
              <option value="non-binary" style={{color:'black'}}>Non-Binary</option>
              <option value="prefer-not-to-say" style={{color:'black'}}>Prefer Not to Say</option>
            </select>
          </div>
          <button className="EditProfile-submit-button" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
