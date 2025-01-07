import React, { useState } from 'react';
import axios from 'axios';

import logo from "../image/logologin.png";
const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const BASE_URL = "https://fullstacksocailmediaproject.onrender.com";
  const handleSearch = async () => {
    try {
      setError('');
      const response = await axios.get(`https://fullstacksocailmediaproject.onrender.com/api/frent/search?username=${username}`);
      setUserData(response.data);
    } catch (err) {
      setUserData(null);
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (

    <>
    <div className="user-search container">
      <h2 className="user-search heading">🔍 Start User Search</h2>
      <div className="user-search input-container">
        <input
          type="text"
          className="user-search input"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="user-search button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <p className="user-search error">{error}</p>}
      {userData && (
        <div className="user-search card">
          <img
               src={userData.profileImage ? `${BASE_URL}/${userData.profileImage}` : logo}
            alt={userData.name || 'User Profile'}
            className="user-search avatar"
          />
          <div>
            <h3 className="user-search user-name">{userData.name}</h3>
            <p className="user-search user-bio">{userData.bio}</p>
          </div>
        </div>
      )}
    </div>







    
    </>
  );
};

export default UserSearch;
