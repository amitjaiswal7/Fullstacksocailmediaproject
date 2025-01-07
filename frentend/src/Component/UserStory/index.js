import React, { useState } from "react";
import Stories from "react-insta-stories";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa";
import logo from "../image/panda.png";
import s1  from  '../image/c10.jpg'
import s2  from  '../image/c8.jpeg'
import s3  from  '../image/c11.jpeg'
import s4  from  '../image/c12.jpeg'
import s5  from  '../image/c14.webp'
import s6  from  '../image/c15.jpeg'
import s7  from  '../image/c9.jpeg'
import s8  from  '../image/newb.png'
import s9  from  '../image/newback.png';
const storiesData = [
  {
    username: "its_tanu_2.o",
    profileImage: s9,
    stories: [
      {
        url: s1,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 10 minutes ago",
          profileImage: s9,
        },
        duration: 3000,
      },
      {
        url: s2,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 5 minutes ago",
          profileImage: s3,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "boubothecrow",
    profileImage: s4,
    stories: [
      {
        url: s5,
        header: {
          heading: "boubothecrow",
          subheading: "Posted 15 minutes ago",
          profileImage: s6,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "_kapil_b",
    profileImage: s7,
    stories: [
      {
        url: s8,
        type: "video",
        header: {
          heading: "_kapil_b",
          subheading: "Posted 5 minutes ago",
          profileImage: logo,
        },
        duration: 8000,
      },
    ],
  },

  {
    username: "its_tanu_2.o",
    profileImage: s9,
    stories: [
      {
        url: s1,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 10 minutes ago",
          profileImage: s9,
        },
        duration: 3000,
      },
      {
        url: s2,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 5 minutes ago",
          profileImage: s3,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "boubothecrow",
    profileImage: s4,
    stories: [
      {
        url: s5,
        header: {
          heading: "boubothecrow",
          subheading: "Posted 15 minutes ago",
          profileImage: s6,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "_kapil_b",
    profileImage: s7,
    stories: [
      {
        url: s8,
        type: "video",
        header: {
          heading: "_kapil_b",
          subheading: "Posted 5 minutes ago",
          profileImage: logo,
        },
        duration: 8000,
      },
    ],
  },


  {
    username: "its_tanu_2.o",
    profileImage: s9,
    stories: [
      {
        url: s1,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 10 minutes ago",
          profileImage: s9,
        },
        duration: 3000,
      },
      {
        url: s2,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 5 minutes ago",
          profileImage: s3,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "boubothecrow",
    profileImage: s4,
    stories: [
      {
        url: s5,
        header: {
          heading: "boubothecrow",
          subheading: "Posted 15 minutes ago",
          profileImage: s6,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "_kapil_b",
    profileImage: s7,
    stories: [
      {
        url: s8,
        type: "video",
        header: {
          heading: "_kapil_b",
          subheading: "Posted 5 minutes ago",
          profileImage: logo,
        },
        duration: 8000,
      },
    ],
  },

  {
    username: "its_tanu_2.o",
    profileImage: s9,
    stories: [
      {
        url: s1,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 10 minutes ago",
          profileImage: s9,
        },
        duration: 3000,
      },
      {
        url: s2,
        header: {
          heading: "its_tanu_2.o",
          subheading: "Posted 5 minutes ago",
          profileImage: s3,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "boubothecrow",
    profileImage: s4,
    stories: [
      {
        url: s5,
        header: {
          heading: "boubothecrow",
          subheading: "Posted 15 minutes ago",
          profileImage: s6,
        },
        duration: 5000,
      },
    ],
  },
  {
    username: "_kapil_b",
    profileImage: s7,
    stories: [
      {
        url: s8,
        type: "video",
        header: {
          heading: "_kapil_b",
          subheading: "Posted 5 minutes ago",
          profileImage: logo,
        },
        duration: 8000,
      },
    ],
  },





];





const UserStoriesHorizontal = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [caption, setCaption] = useState("");

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setCurrentStoryIndex(0);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setCurrentStoryIndex(0);
  };

  const openUploadModal = () => {
    setUploadModalVisible(true);
  };

  const closeUploadModal = () => {
    setUploadModalVisible(false);
  };

  const goToNextStory = () => {
    if (currentStoryIndex < selectedUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeModal(); // Close modal when the last story ends
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleUpload = () => {
    if (!caption.trim()) {
      alert("Please add a caption or upload a file.");
      return;
    }
    alert("Story uploaded successfully!");
    setCaption("");
    setUploadModalVisible(false);
  };

  return (
    <>
      <div className="stories-navbar">
        <div className="story-item-currentuser">
          <div className="story-circle-currentuser">
            <img
              src={logo}
              alt="Current User"
              className="profile-image"
              onClick={() => handleProfileClick(storiesData[0])} // Open current user's stories
            />
            <div className="plus-icon" onClick={openUploadModal}>
              <FaPlus />
            </div>
          </div>
          <span className="username">You</span>
        </div>

        {storiesData.map((story, index) => (
          <div className="story-item" key={index} onClick={() => handleProfileClick(story)}>
            <div className="story-circle">
              <img
                src={story.profileImage}
                alt={`${story.username}'s profile`}
                className="profile-image"
              />
            </div>
            <span className="username">{story.username}</span>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {selectedUser && (
        <div className="modal">
          <div className="modal-content glassmorphism">
            <FaArrowLeft className="back-icon" onClick={closeModal} />
            <h3 className="modal-header">{selectedUser.username}'s Stories</h3>
            <div className="story-navigation">
              <FaArrowLeft
                className={`nav-icon ${currentStoryIndex === 0 ? "disabled" : ""}`}
                onClick={goToPreviousStory}
              />
              <Stories
                stories={selectedUser.stories}
                currentIndex={currentStoryIndex}
                defaultInterval={3000}
                width={300}
                height={500}
                storyContainerStyles={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                }}
                onStoryEnd={goToNextStory}
                loop={false}
                keyboardNavigation={true}
              />
              <FaArrowRight
                className={`nav-icon ${
                  currentStoryIndex === selectedUser.stories.length - 1 ? "disabled" : ""
                }`}
                onClick={goToNextStory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalVisible && (
        <div className="upload-modal">
          <div className="modal-content glassmorphism">
            <FaArrowLeft className="back-icon" onClick={closeUploadModal} />
            <h3 className="modal-header">Upload Story</h3>
            <textarea
              placeholder="Add a caption (optional)"
              className="caption-input"
              value={caption}
              onChange={handleCaptionChange}
            ></textarea>
            <input type="file" accept="image/*,video/*" className="file-input" />
            <button className="upload-button" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserStoriesHorizontal;
