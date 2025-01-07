import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { FaEdit, FaChevronDown, FaPhoneAlt, FaVideo, FaQuestionCircle, FaMicrophone, FaImage, FaPaperPlane } from 'react-icons/fa';
import { fetchUsers, fetchMessages, sendMessage } from '../Socketio/index';
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:8000"; // Update with your backend URL
const socket = io(BASE_URL);

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    // Handle screen resize for responsiveness
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUsers().then(({ data }) => setUsers(data));
    socket.emit("joinRoom", currentUserId);
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  const handleSelectChat = (user) => {
    setSelectedChat(user);
    fetchMessages(currentUserId, user._id).then(({ data }) => setMessages(data));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: currentUserId,
      receiver: selectedChat._id,
      message: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  const handleBackToChatList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="chat-page-container">
      {/* Sidebar: Chat List */}
      <div
        className={`chat-list-container ${isMobile && selectedChat ? 'hidden' : ''}`}
      >
        <div className="main-user-chat">
          <div className="server-name">
            Chats <FaChevronDown className="chevron-icon" />
          </div>
          <FaEdit className="server-edit-icon" />
        </div>
        {users.map((user) => (
          <div
            className={`chat-item ${selectedChat?._id === user._id ? 'selected' : ''}`}
            key={user._id}
            onClick={() => handleSelectChat(user)}
          >
            <img
              src={user.profileImage ? `${BASE_URL}/${user.profileImage}` : 'https://via.placeholder.com/50'}
              alt={`${user.name}'s profile`}
              className="profile-picture"
            />
            <div className="chat-details">
              <div className="chat-header">
                <span className="username" style={{color:'black'}} >{user.name}</span>
              </div>
              <div className="chat-message">
                <span className="last-message">Click to view chat</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      {selectedChat && (
        <div className={`chat-interface ${isMobile ? 'mobile-view' : ''}`}>
          <div className="chat-top-bar">
            {isMobile && (
              <IoMdArrowBack
                className="back-icon"
                onClick={handleBackToChatList}
              />
            )}
            <div className="top-left">
              <img
                src={selectedChat.profileImage ? `${BASE_URL}/${selectedChat.profileImage}` : 'https://via.placeholder.com/50'}
                alt="User Profile"
                className="profile-picture-small"
              />
              <span className="top-username">{selectedChat.name}</span>
            </div>
            <div className="top-right-icons">
              <FaPhoneAlt className="icon" />
              <FaVideo className="icon" />
              <FaQuestionCircle className="icon" />
            </div>
          </div>
          <hr className="top-divider" />
          <div className="chat-area">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.sender === currentUserId ? 'chat-bubble-right' : 'chat-bubble-left'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>
          <div className="input-bar">
            <FaImage className="input-icon" />
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <FaMicrophone className="input-icon input-icon-right" />
            <button className="send-button" onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
