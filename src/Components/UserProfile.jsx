import React, { useContext, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import {Stack, Box, Avatar, Button, Backdrop} from '@mui/material'
import SideBar from './SideBar'
import Navbar from './Navbar'
import { userDataContext } from '../App'
import EditForm from './EditForm'
import { db } from '../firebase'
import { getDoc, doc } from 'firebase/firestore'
import { arrayUnion, arrayRemove } from 'firebase/firestore'
import ProfilePost from './ProfilePost'
import Modal_Alert from './Modal_Alert'
import '../stylesheets/userProfile.css'
import Modal from './Modal'
import NotificationModal from './NotificationModal'
import firebase from 'firebase/compat/app'
import '../stylesheets/mediaQueryHome.css'

const UserProfile = () => {
    const {currentUser, notificationModalDisplay, setNotificationModalDisplay, editFormStatus, setEditFormStatus, alertDisplay, setAlertDisplay, currentUserProfileData} = useContext(userDataContext)
    const {username} = useParams()
    const [userProfileData, setUserProfileData] = useState({})
    const [profilePost, setProfilePost] = useState([])

    const [modalDisplay, setModalDisplay] = useState({
        open: false,
        heading: '',
        content: []
    })
    
    const setStatus = () => {
        setEditFormStatus('inline-block')
    }

    const showFollowers = () => {
        setModalDisplay({
            open: true,
            heading: 'Followers',
            content: userProfileData?.followers
        })
    }

    const showFollowing = () => {
        setModalDisplay(
            {
                open: true,
                heading: 'Following',
                content: userProfileData?.following
            }
        )
    }

    const sendFollowRequest = () => {
        db.collection('usersData').doc(username).update({requests:  
            arrayUnion(
                {
                    reqUsername: currentUserProfileData?.username,
                    reqFullname: currentUserProfileData?.fullname,
                    reqProfilePic: currentUserProfileData?.profilePic
                }
            )
        }
        )
        .then(setAlertDisplay
            ({
                status: 'success',
                msg: 'sent friend request',
                open: true
            }))
        .catch(error => setAlertDisplay({
            status: 'error',
            msg: error,
            open: true
        }))
    }

    const deleteFollowRequest = () => {
        db.collection('usersData').doc(username).update({
            requests: firebase.firestore.FieldValue.arrayRemove({
                reqUsername: currentUserProfileData?.username,
                reqFullname: currentUserProfileData?.fullname,
                reqProfilePic: currentUserProfileData?.profilePic
            })
        })
        .then(setAlertDisplay
            ({
                status: 'success',
                msg: 'Friend request reverted',
                open: true
            }))
    }

    useEffect(() => {
        console.log('data called')
        // const fetchData = async() => {
        // //     NOT REALTIME DATA UPDATE
        //     const docRef = doc(db, 'usersData', username)
        //     const docSnap = await getDoc(docRef)
        //     console.log(docSnap.data())
        //     setUserProfileData(docSnap.data())
        // }

        setNotificationModalDisplay({
            open: false,
            content: [],
            type: 'none'
        })
        
        db.collection('posts').where('username', '==', username).orderBy('time', 'desc').onSnapshot(snapshot => {
            setProfilePost(snapshot.docs.map((doc) => {
                console.log(doc.data())
                return(
                    {
                        id: doc.id,
                        postData: doc.data()
                    }
                )
            }))
        })

        // fetchData()
      }, [editFormStatus, username])

      useEffect(() => {
        db.collection('usersData').doc(username).onSnapshot(doc => {
            setUserProfileData(doc.data())
        })
      }, [username, editFormStatus])

    console.log(profilePost)
    return (
        <>
            <Modal_Alert alertDisplay={alertDisplay} setAlertDisplay={setAlertDisplay}/>
            <Navbar/>
            <div className='mainHomeBox'>
                {/* sidebar */}
                <Box className='leftsideBar'>
                    <SideBar currentUsername={currentUser?.displayName} setNotificationModalDisplay={setNotificationModalDisplay}/>
                </Box>

                {/* post section */}
                <Box className='userProfileMainBox'>
                    <Box className='userProfilePhotoSection'>
                        <Stack direction='row' spacing={5} alignItems='flex-start' backgroundColor= "white" borderRadius='10px'>
                            <Box pt='7px'>
                                <Avatar className='userAvatarProfilePic' src={userProfileData?.profilePic} />
                            </Box>

                            <Stack width='100%' direction='row' justifyContent='space-between' alignItems='flex-start'>
                                <Stack>
                                    <Stack direction='row' alignItems='center' spacing={2.5}>
                                        <p className='profileUserName'>{username}</p>
                                        {username !== currentUser?.displayName ?
                                            userProfileData?.followers?.some(acc => acc.followerUsername == currentUser?.displayName) ?
                                            <p className='followingBtnUserProfile fontType'>Following</p>
                                            : userProfileData?.requests?.some(acc => acc.reqUsername == currentUser?.displayName) ?
                                            <p onClick={deleteFollowRequest} className='requestBtnUserProfile fontType'>Requested</p>
                                            :
                                            <p onClick={sendFollowRequest} className='followBtnUserProfile fontType'>Follow</p>
                                        :
                                            ''
                                        }
                                    </Stack>
                                    <Stack mt='12px' direction='row' spacing={3} alignItems='center'>
                                        {/* no. of posts */}
                                        <Stack direction='row' spacing={0.8} alignItems='center'>
                                        <p className='fontType' style={{fontSize: '16px', color: '#222', fontWeight: '600'}}>{profilePost?.length}</p>
                                        <p className='fontType' style={{fontSize: '16px', color: '#222'}}>Posts</p>
                                        </Stack>
                                        {/* no. of followers */}
                                        <Stack onClick={showFollowers} direction='row' spacing={0.8} alignItems='center'>
                                        <p className='fontType' style={{fontSize: '16px', color: '#222', fontWeight: '600'}}>{userProfileData?.followers?.length}</p>
                                        <p className='fontType' style={{fontSize: '16px', color: '#222'}}>Followers</p>
                                        </Stack>
                                        {/* no. of followings */}
                                        <Stack onClick={showFollowing} direction='row' spacing={0.8} alignItems='center'>
                                        <p className='fontType' style={{fontSize: '16px', color: '#222', fontWeight: '600'}}>{userProfileData?.following?.length}</p>
                                        <p className='fontType' style={{fontSize: '16px', color: '#222'}}>Following</p>
                                        </Stack>
                                    </Stack>

                                    <p className='profile_Fullname'>{userProfileData?.fullname}</p>
                                    {userProfileData?.biodata?.map((bio) => {
                                        return(
                                            <p className='bioData fontType'>{bio}</p>
                                        )
                                    })}
                                    <a className='bioLink fontType' href={userProfileData?.biolink} >{userProfileData?.biolink}</a>
                                </Stack>
                                {currentUser?.displayName == username &&
                                    <Button onClick={setStatus} className='fontType' style={{border: 'none', color: '#198779', textTransform: 'capitalize', fontSize: '14.5px', backgroundColor: '#ECFFF6'}}>Edit Profile</Button>
                                }
                            </Stack>
                        </Stack>

                        <Box mt='50px' backgroundColor='white' borderRadius='5px'>
                            <p className='fontType' style={{fontSize:'14px', textAlign: 'center', fontWeight: '600', padding: '5px 0px'}}>POSTS</p>
                        </Box>

                        <Stack mt='6px' direction='row' alignItems='center' flexWrap='wrap'>
                            {profilePost?.map((data) => {
                                return(
                                    <ProfilePost data={data} currentUser={currentUser} id={data.id}/>
                                )
                            })}
                        </Stack>
                    </Box>
                </Box>
            </div>

            {/* profile details edit form */}
            {editFormStatus == 'inline-block' &&
            <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <EditForm 
                    setEditFormStatus={setEditFormStatus} 
                    userProfileData={userProfileData}
                    alertDisplay={alertDisplay} 
                    setAlertDisplay={setAlertDisplay}
                />
            </Backdrop>
            } 

            {modalDisplay?.open == true &&
                <Modal 
                    open={modalDisplay?.open} 
                    heading={modalDisplay?.heading} 
                    content={modalDisplay?.content}
                    setModalDisplay={setModalDisplay}    
                />
            }

            {notificationModalDisplay?.open == true &&
                <NotificationModal content={notificationModalDisplay?.content} type={notificationModalDisplay?.type} setNotificationModalDisplay={setNotificationModalDisplay}/>
            }
        </>
    )
}

export default UserProfile
