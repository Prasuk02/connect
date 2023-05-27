import React, { useState, useEffect, useContext } from 'react'
import { Box, Stack, Backdrop } from '@mui/material'
import { db, auth } from '../firebase'
import { userDataContext } from '../App'
import SideBar from './SideBar'
import Navbar from './Navbar'
import Post from './Post'
import AddNewPost from './AddNewPost'
import RightSideBar from './RightSideBar'
import NotificationModal from './NotificationModal'
import Modal_Alert from './Modal_Alert'
import EditForm from './EditForm'
import '../stylesheets/mediaQueryHome.css'

const Home = () => {
    const { signupCredentials, currentUser, setCurrentUser, editFormStatus, setEditFormStatus, alertDisplay, setAlertDisplay } = useContext(userDataContext)
    const {currentUserProfileData, setCurrentUserProfileData, notificationModalDisplay, setNotificationModalDisplay} = useContext(userDataContext)
    const {createPostDisplay, setCreatePostDisplay, posts, setPosts} = useContext(userDataContext)

    useEffect(() => {
        // if the user is logged in user will return the details, else return null
        // .onAuthStateChanged get triggered whenever the user logged in or logged out
        
        auth.onAuthStateChanged((authUser) => {
            if(authUser){
                // user is signed in
                // console.log(authUser)
                if(Object.keys(signupCredentials).length != 0){
                    // new user
                    authUser.updateProfile({
                        displayName: signupCredentials.username
                    })
                    .then(() => {
                        setCurrentUser(authUser)
                        console.log('currentUser created')
                    })
                    
                    db.collection("usersData").doc(signupCredentials.username).set({
                        username: signupCredentials.username,
                        fullname: signupCredentials.fullname,
                        email: signupCredentials.loginId,
                        post: [],
                        followers: [],
                        following: [],
                        requests: [],
                        profilePic: '',
                        biolink: ' ',
                        biodata: [],
                        uid: authUser?.uid
                    }).then(() => {
                        setAlertDisplay({
                            status: 'success',
                            msg: 'Login Successful',
                            open: true
                        })
                    })
                }
                else{
                    setCurrentUser(authUser)
                }
            }
            else{
                // user Logged out
                setCurrentUser(null)
            }
        })
    }, [])

    useEffect(() => {
        // const fetchCurrentUserData = async() => {
        //     console.log(currentUser?.displayName)
        //     const dbRef = doc(db, 'usersData', currentUser?.displayName)
        //     const docSnap = await getDoc(dbRef)
        //     console.log(docSnap.data())
        //     setCurrentUserProfileData(docSnap.data())
        // }

        // real-time
        const fetchCurrentUserData = async() => {
            db.collection('usersData').doc(currentUser?.displayName).onSnapshot(doc => {
                setCurrentUserProfileData(doc.data())
            })
        }

        if(currentUser){
            fetchCurrentUserData()
        }
        
    }, [currentUser])

    // using useEffect to get data from our firebase db
    // in this case useEffect is called just once when the page reloads/refreshed
    // onSnapshot() -> it is a db listener, everytime when the data changes in selected collection 
    // everytime when post added this functions will be executed/fired, and show realtime effect in our app
    useEffect(() => {
        db.collection('posts').orderBy('time', 'desc').onSnapshot(snapshot => {
            //snapshot.doc -> return the array/list of docs
            //docs.map iterate througn each docs and return doc.data in form of array of objects [data present inside each doc]
            setPosts(snapshot.docs.map((doc) => {
                // console.log(doc.data())
                return(
                    {
                        id: doc.id,                             // return id of doc
                        postData: doc.data()                    // return data inside each doc in form of object
                    }
                )                    
            }
            ))
        })
    }, [currentUserProfileData])
    
    // console.log(posts)
    // console.log(currentUserProfileData)
    console.log("currentUser")
    console.log(currentUser)
    
    return (
        <>
            <Modal_Alert alertDisplay={alertDisplay} setAlertDisplay={setAlertDisplay}/>
            <Navbar/>
            {createPostDisplay?.open == 'true' &&
                <AddNewPost username={currentUser?.displayName}/>
            }
            {/* <Stack className='mainHomeBox' direction='row'> */}
            <div className='mainHomeBox'>
                {/* sidebar */}
                <Box className='leftsideBar'>
                    <SideBar currentUsername={currentUser?.displayName} setNotificationModalDisplay={setNotificationModalDisplay}/>
                </Box>

                {/* post section */}
                <Box className='postSection'>
                    {/* benifit of adding id is that:- before adding key react render the whole list as it is not sure which item is added or removed fom list, but if we add unique key that is id of the post, now react will know which element is pushed or pulled from the list and now react will only re-render the new posts and not the old ones*/}
                    {posts?.map((post) => {
                        // console.log(id)
                        return(
                            <Post 
                                key={post.id}
                                id={post.id}
                                imageUrl={post?.postData?.imageUrl}
                                username={post?.postData?.username}
                                caption={post?.postData?.caption}
                                likes={post?.postData?.likes}
                                currentUsername={currentUser?.displayName}
                                currentUserProfileData = {currentUserProfileData}
                                postData={post?.postData}
                                />
                        )
                    })}
                </Box>

                {/* suggestion section */}
                <Box className='rightSideBar'>
                    <RightSideBar
                        username={currentUser?.displayName}
                        currentUserProfileData={currentUserProfileData}
                        />
                </Box>
            </div>
            {/* </Stack> */}

            
            {notificationModalDisplay?.open == true &&
                <NotificationModal content={notificationModalDisplay?.content} type={notificationModalDisplay?.type} totalNotifications={notificationModalDisplay?.content?.length} setNotificationModalDisplay={setNotificationModalDisplay}/>
            }

            {/* {editFormStatus == 'inline-block' &&
            <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <EditForm 
                    setEditFormStatus={setEditFormStatus} 
                    userProfileData={currentUserProfileData}
                    alertDisplay={alertDisplay} 
                    setAlertDisplay={setAlertDisplay}
                />
            </Backdrop>
            }  */}
        </>
    )
}

export default Home
