import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  AiOutlineMenu,
  AiOutlineHeart,
} from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";


import { AuthContext } from "../AuthContext";


const MobileSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/signup");
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
      action: handleLogout,
    },
  ];

  // Close sidebar on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDrawerOpen]);

  return (
    <div className="mobilemenu-container">
      {/* Mobile Header */}
      <div className="mobilemenu-header">
        <AiOutlineMenu
          className="mobilemenu-toggle-icon"
          onClick={toggleDrawer}
        />
   <div className="mobilemenu-right-icons"  >
  <Link to="/notification">
    <AiOutlineHeart className="mobilemenu-heart-icon" style={{color:'white'}} /> 
  </Link>
  <Link to="/chatlist">
    <AiOutlineMessage className="mobilemenu-message-icon" style={{color:'white'}} />
  </Link>
</div>

      </div>

      {/* Sidebar Drawer */}
      <div
        ref={sidebarRef}
        className={`mobilemenu-sidebar ${
          isDrawerOpen ? "mobilemenu-open" : "mobilemenu-closed"
        }`}
      >
        <div className="mobilemenu-logo">
          <img src="" alt="Logo" />
        </div>
        <ul className="mobilemenu-list">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="mobilemenu-item"
              onClick={item.action ? item.action : toggleDrawer}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Other Components */}
  
    </div>
  );
};

export default MobileSidebar;
