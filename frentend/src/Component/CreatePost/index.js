import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({ text: '', image: null });
  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text || !formData.image) {
      toast.error('Please fill all fields.');
      return;
    }

    const postData = new FormData();
    postData.append('userId', userId);
    postData.append('text', formData.text);
    postData.append('image', formData.image);

    try {
      const response = await axios.post('https://fullstacksocailmediaproject.onrender.com/api/posts', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating post');
    }
  };

  return (
    <div className="create-post-container">
      <ToastContainer />
      <div className="create-post-card">
        <h2>Create Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Text</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="What's on your mind?"
              required
            />
          </div>
          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
