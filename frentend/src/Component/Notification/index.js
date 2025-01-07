import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?._id; // Current user ID
  const BASE_URL = 'https://fullstacksocailmediaproject.onrender.com/api/allposts';

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        toast.error('User not logged in.');
        return;
      }

      try {
        const { data } = await axios.get(`${BASE_URL}/notifications/${userId}`);
        setNotifications(data);
      } catch (err) {
        toast.error('Failed to load notifications.');
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div className="notification-container">
      <ToastContainer />
      <h2 className="notification-header">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            <img
              src={`${BASE_URL}/${notification.triggeredBy?.profileImage}`}
              alt="User"
              className="notification-user-image"
            />
            <div className="notification-details">
              <strong className="notification-user-name">
                {notification.triggeredBy?.name || 'Unknown User'}
              </strong>
              <p className="notification-message">{notification.message}</p>
              {notification.postId && (
                <img
                  src={`${BASE_URL}/${notification.postId.image}`}
                  alt="Post"
                  className="notification-post-image"
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="no-notifications">No notifications yet.</p>
      )}
    </div>
  );
};

export default NotificationPage;
