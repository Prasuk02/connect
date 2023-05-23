import React, { useState, useEffect, useContext } from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar'
import { Box, Stack} from '@mui/material'
import { db, auth } from '../firebase'
import { userDataContext } from '../App'
import NotificationModal from './NotificationModal'
import Modal_Alert from './Modal_Alert'
import ProfilePost from './ProfilePost'
import LikedPostsBox from './LikedPostsBox'
import { useParams } from 'react-router-dom'

const PostLiked = () => {
    const {currentUser, alertDisplay, setAlertDisplay, currentSelect } = useContext(userDataContext)
    const {currentUserProfileData, setCurrentUserProfileData, notificationModalDisplay, setNotificationModalDisplay} = useContext(userDataContext)
    const {myPosts} = useParams()

    console.log(myPosts)
    return (
        <>
            <Modal_Alert alertDisplay={alertDisplay} setAlertDisplay={setAlertDisplay}/>
            <Navbar/>
            <Stack direction='row'>
                {/* sidebar */}
                <Box width='18%'>
                    <SideBar currentUsername={currentUser?.displayName} setNotificationModalDisplay={setNotificationModalDisplay}/>
                </Box>

                {/* post section */}
                <Box width='82%' px='70px'>
                    <Box backgroundColor='white' p='8px' mt='40px' border='1px solid #eee' borderRadius='8px'>
                        <p style={{fontSize: '14px', fontWeight: '600', textAlign: 'center', textTransform: 'uppercase'}}>{myPosts} POST</p>
                    </Box>
                    <Stack mt='5px' direction='row' alignItems='center' flexWrap='wrap'>
                        {myPosts == 'liked' ?
                        // post liked data
                        currentUserProfileData?.postsLiked?.slice(0).reverse().map((post) => {
                            return(
                                <LikedPostsBox id={post.postId}/>
                            )
                        })
                        :
                        // postSaved data
                        currentUserProfileData?.postSaved?.slice(0).reverse().map((post) => {
                            return(
                                <LikedPostsBox id={post.postId}/>
                            )
                        })
                    }
                    </Stack>
                </Box>
            </Stack>

            {notificationModalDisplay?.open == true &&
                <NotificationModal content={notificationModalDisplay?.content} type={currentSelect} setNotificationModalDisplay={setNotificationModalDisplay}/>
            }
        </>
    )
}

export default PostLiked
