import React from 'react';
import './App.css';
import { Routes,Route} from 'react-router-dom';
import SignUp from './Component/SingUp';
import SignIn from './Component/Singin';
import Sidebar from './Component/Sidebar';
import ProfilePage from './Component/ProfilePage';
import CreatePost from './Component/CreatePost';
import EditProfile from './Component/EditProfile';
import AllPost from './Component/AllPost';
import ChatPage  from './Component/ChatList';
import NotificationPage from './Component/Notification';
import SuggestedUser from './Component/SurgestUser';
import MobileSidebar from './Component/MbileNavbar';
import UserStoriesHorizontal from './Component/UserStory';
import AllUserProfile from './Component/AllProfileuser';
import Explore from './Component/Eplore';
import UserSearch from './Component/Search';
function App() {
  return (
    <>
      <Routes>
     <Route path="/"  element={<Sidebar/>} />
    <Route path="/singin" element={<SignIn/>}/>
    <Route path="/signup" element={<SignUp/>}/>
    <Route path="/profile" element={<ProfilePage/>}/>
    <Route path="/createpost" element={<CreatePost/>}/>
    <Route path="/createpost" element={<CreatePost/>}/>
    <Route path="/editprofile" element={<EditProfile/>}/>
    <Route path="/allpost" element={<AllPost/>}/>
    <Route path="/notification" element={<NotificationPage/>}/>
    <Route path="/surgest" element={<SuggestedUser/>}/>
    <Route path="/chatlist" element={<ChatPage/>}/>
    <Route path="/mobilelist" element={<MobileSidebar/>}/>
    <Route path="/userstory" element={<UserStoriesHorizontal/>}/>
    <Route path="/profile/:userId" element={<AllUserProfile />} />    
    <Route path="/explore" element={<Explore />} />    
    <Route path="/search" element={<UserSearch />} />    
        
        
      </Routes>
    </>
  );
}

export default App;
