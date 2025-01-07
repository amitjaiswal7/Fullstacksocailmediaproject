import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart, FaShare, FaRegComment, FaEllipsisV } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AllPost = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activePostId, setActivePostId] = useState(null); // Track the active post's dialog box
  const BASE_URL = 'https://fullstacksocailmediaproject.onrender.com/api/allposts';

  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem('user'))?._id;
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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

  const handleLikePost = async (postId) => {
    if (!userId) {
      toast.error('You must be logged in to like a post.');
      return;
    }
    try {
      const { data } = await axios.post(`${BASE_URL}/${postId}/like`, { userId });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );
      toast.success(data.likes.includes(userId) ? 'Liked successfully!' : 'Disliked successfully!');
    } catch (err) {
      toast.error('Failed to process the like action. Please try again later.');
    }
  };

  const handleAddComment = async (postId) => {
    if (!userId) {
      toast.error('You must be logged in to comment on a post.');
      return;
    }
    if (!commentText.trim()) {
      toast.warn('Cannot add an empty comment.');
      return;
    }
    try {
      const { data } = await axios.post(`${BASE_URL}/${postId}/comment`, {
        userId,
        text: commentText,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: data.comments } : post
        )
      );
      setCommentText('');
      toast.success('Comment added successfully!');
    } catch (err) {
      toast.error('Failed to add the comment. Please try again later.');
    }
  };

  const toggleDialog = (postId) => {
    setActivePostId((prevId) => (prevId === postId ? null : postId));
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${BASE_URL}/${postId}/comment/${commentId}`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: post.comments.filter((c) => c._id !== commentId) }
            : post
        )
      );
      toast.success('Comment deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete the comment. Please try again later.');
    }
  };

  return (
    <div className="AllPost-container">
      <ToastContainer />
      {posts.map((post) => (
        <div key={post._id} className="AllPost-post-container">
          <div className="AllPost-post-header">
            <img
              src={`${BASE_URL}/${post.userId?.profileImage}`}
              alt="Profile"
              className="AllPost-profile-image"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
            />
            <span className="AllPost-profile-name" style={{color:'black'}} >{post.userId?.name || 'Unknown User'}</span>
          </div>
          <img
            src={`${BASE_URL}/${post.image}`}
            alt="Post"
            className="AllPost-post-image"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
          />
          <div className="AllPost-post-footer">
            <div className="AllPost-post-actions">
              <div onClick={() => handleLikePost(post._id)}   style={{color:'black'}}>
                {post.likes.includes(userId) ? <FaHeart color="red" /> : <FaRegHeart  style={{color:'black'}}  />  }
                <span>{post.likes.length}</span>
              </div>
              <FaRegComment onClick={() => toggleDialog(post._id)}  style={{color:'black'}} />
              <FaShare   style={{color:'black'}}  />
            </div>
          </div>


          <div className="AllPost-comment-input-container">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="AllPost-comment-text-input"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="AllPost-comment-submit-button"
                  >
                    Post
                  </button>
                </div>



  



          {activePostId === post._id && (
            <div className="AllPost-dialog-overlay" onClick={() => toggleDialog(post._id)}>
              <div
                className="AllPost-dialog-box"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the box
              >
                <button
                  className="AllPost-close-button"
                  onClick={() => toggleDialog(post._id)}
                >
                  &times;
                </button>
                <div className="AllPost-comments-section">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="AllPost-comment">
                      <img
                        src={`${BASE_URL}/${comment.userId?.profileImage}`}
                        alt="Profile"
                        className="AllPost-comment-profile-image"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/30')}
                      />
                      <div className="AllPost-comment-content">
                        <strong  style={{color:'black'}} >{comment.userId?.name || 'Anonymous'}</strong>
                        <p style={{color: 'black'}} >{comment.text}</p>
                        <span style={{color: 'black'}} >{new Date(comment.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="AllPost-comment-actions">
                        <FaShare className="AllPost-share-icon" />
                        {post.userId === userId && (
                          <FaEllipsisV
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            className="AllPost-delete-icon" style={{color: 'black'}}
                          />
                        )}
                      </div>
                    </div>
                 
                 

                       
              




                  ))}

  

                </div>
                <div className="AllPost-comment-input-container">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="AllPost-comment-text-input"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="AllPost-comment-submit-button"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllPost;
