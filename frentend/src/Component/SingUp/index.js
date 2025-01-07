import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to sign up
      const response = await axios.post("https://fullstacksocailmediaproject.onrender.com/api/auth/signup", formData);
      const { data } = response;

      if (data && data.success) {
        // Show success message
        toast.success(data.message);

        // Store user _id in localStorage for future use
        localStorage.setItem('userId', data.user.id);

        // Optional: Store full user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to home or another page
        navigate('/');
      } else {
        // Handle API errors
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      // Handle server errors
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="signup-page">
      <ToastContainer />
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">Create Your Account</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={{color:'black'}}  />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                  style={{color:'black'}}  />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{color:'black'}}   />
            </div>

            {/* Signup Button */}
            <button type="submit" className="signup-button">Sign Up</button>
          </form>

          {/* Link to Sign In */}
          <div className="signin-link">
            <p>Already have an account? <Link to="/singin">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
