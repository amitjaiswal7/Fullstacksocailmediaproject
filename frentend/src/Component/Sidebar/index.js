import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuggestedUser from "../SurgestUser";
import AllPost from "../AllPost";
import MobileSidebar from "../MbileNavbar";
import UserStoriesHorizontal from "../UserStory";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineCompass,
  AiOutlineVideoCamera,
  AiOutlineMessage,
  AiOutlineBell,
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";

 // Import your logo
import { AuthContext } from "../AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext); // Get user and logout function from AuthContext
  const navigate = useNavigate();



  const handleLogout = () => {
    logout();
    navigate("/signup"); // Redirect to signup page after logout
  };

  const menuItems = [
    { icon: <AiOutlineHome />, label: "Home", path: "/" },
    { icon: <AiOutlineSearch />, label: "Search", path: "/search" },
    { icon: <AiOutlineCompass />, label: "Explore", path: "/explore" },
    { icon: <AiOutlineVideoCamera />, label: "Reels", path: "/reels" },
    { icon: <AiOutlineMessage />, label: "Messages", path: "/chatlist" },
    { icon: <AiOutlineBell />, label: "Notifications", path: "/notification" },
    { icon: <AiOutlinePlus />, label: "Create", path: "/createpost" },
    { icon: <FaUserEdit />, label: "Edit Profile", path: "/editprofile" },
    {
      icon: <AiOutlineUser />,
      label: user ? user.name : "Sign Up",
      path: user ? "/profile" : "/signup",
    },
    {
      icon: <AiOutlineLogout />,
      label: "Logout",
      path: "#",
      action: handleLogout, // Custom action for logout
    },
  ];

  return (
    <>
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <img src='' alt="Logo" />
      </div>

      {/* Menu Items */}
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="menu-item"
            onClick={item.action ? item.action : undefined} // Bind custom action if present
          >
            <Link to={item.path}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    <MobileSidebar/>
    <UserStoriesHorizontal/>
    <SuggestedUser/>
    <AllPost/>
    </>
  );
};

export default Sidebar;
