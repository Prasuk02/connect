import React, { createContext, useState }from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './Components/Login';
import Signup from './Components/Signup';
import PageNotFound from './Components/PageNotFound';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile';
import './App.css'
import PostLiked from './Components/PostLiked';
import Chats from './Components/Chats';
import Explore from './Components/Explore';
import CandyCrush from './Components/CandyCrush';

export const userDataContext = createContext("")

function App() {
  const [signupCredentials, setSignupCredentials] = useState({})
  const [currentUser, setCurrentUser] = useState()
  const [currentUserProfileData, setCurrentUserProfileData] = useState({})
  const [notificationModalDisplay, setNotificationModalDisplay] = useState({
    open: false,
    content: [],
    type: 'none'
})
  const [loader, setLoader] = useState(false)
  const [editFormStatus, setEditFormStatus] = useState('none')
  const [alertDisplay, setAlertDisplay] = useState({
    status: 'warning',
    msg: 'Set message',
    open: false
  })
  const [currentSelect, setCurrentSelect] = useState('Home')
  const [createPostDisplay, setCreatePostDisplay] = useState({
    open: false
  })

  const [posts, setPosts] = useState([])
  return(
    <>
      <userDataContext.Provider value={{
                                  signupCredentials, setSignupCredentials, 
                                  currentUser, setCurrentUser, 
                                  currentUserProfileData, setCurrentUserProfileData, 
                                  notificationModalDisplay, setNotificationModalDisplay, 
                                  loader, setLoader, 
                                  editFormStatus, setEditFormStatus,
                                  alertDisplay, setAlertDisplay,
                                  currentSelect, setCurrentSelect,
                                  createPostDisplay, setCreatePostDisplay,
                                  posts, setPosts
                                  }}>
        <Router>
          <Routes>
            <Route path='/' exact element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/user/:username' element={<UserProfile/>}/>
            <Route path='/posts/:myPosts' element={<PostLiked/>}/>
            <Route path='*' element={<PageNotFound/>}/>
            <Route path='/chats' element={<Chats/>}/>
            <Route path='/explore' element={<Explore/>}/>
            <Route path='/game' element={<CandyCrush/>}/>
          </Routes>
        </Router>
      </userDataContext.Provider>
    </>
  );
}

export default App;