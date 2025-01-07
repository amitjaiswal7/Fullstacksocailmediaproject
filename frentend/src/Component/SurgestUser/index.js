import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../image/logologin.png";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SuggestedUser = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
  const BASE_URL = "http://localhost:8000";
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestedUsers();
  }, [page]);

  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/suggested?page=${page}&limit=5&currentUserId=${currentUserId}` // Changed limit to 5
      );
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  };
  
  const handleFollow = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/follow/${id}`, { userId: currentUserId });
      toast.success("Followed successfully!");
      fetchSuggestedUsers();
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user.");
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/unfollow/${id}`, { userId: currentUserId });
      toast.success("Unfollowed successfully!");
      fetchSuggestedUsers();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Failed to unfollow user.");
    }
  };

  return (
    <div className="suggesteduser-container">
      <h2 className="suggesteduser-title">Suggested for you</h2>
      {users.map((user) => (
        <div key={user._id} className="suggesteduser-card">
          <img
            src={user.profileImage ? `${BASE_URL}/${user.profileImage}` : logo}
            alt="User Profile"
            className="suggesteduser-image"
          />
          <div className="suggesteduser-details">
            <h3
              className="suggesteduser-name"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              {user.name}
            </h3>
            <p className="suggesteduser-bio">{user.bio}</p>
          </div>
          <div className="suggesteduser-actions">
            {user.followers.includes(currentUserId) ? (
              <button onClick={() => handleUnfollow(user._id)} className="suggesteduser-follow-btn">
                Unfollow
              </button>
            ) : (
              <button onClick={() => handleFollow(user._id)} className="suggesteduser-follow-btn">
                Follow
              </button>
            )}
            <button className="suggesteduser-react-btn">
              <RxCross2 />
            </button>
          </div>
        </div>
      ))}
     <div className="pagination">
  {page > 1 && <button onClick={() => setPage(page - 1)}>Previous</button>}
  {page * 5 < total && <button onClick={() => setPage(page + 1)}>View More</button>} {/* Changed from 10 to 5 */}
</div>

      <ToastContainer />
    </div>
  );
};

export default SuggestedUser;
