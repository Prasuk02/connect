import React, { useState, useEffect, useContext } from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar'
import { Box, Stack} from '@mui/material'
import { db, auth } from '../firebase'
import { userDataContext } from '../App'
import NotificationModal from './NotificationModal'
import Modal_Alert from './Modal_Alert'
import LikedPostsBox from './LikedPostsBox'
import ProfilePost from './ProfilePost'
import { postCategoriesContent } from '../content/sidebarContent'
import '../stylesheets/explore.css'
import '../stylesheets/mediaQueryHome.css'

const Explore = () => {
    const {currentUser, alertDisplay, setAlertDisplay, currentSelect, posts } = useContext(userDataContext)
    const {currentUserProfileData, setCurrentUserProfileData, notificationModalDisplay, setNotificationModalDisplay} = useContext(userDataContext)
    const explorePosts = [...posts]

    const moveRight = () => {

    }

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
                        <Stack mb='15px' mt='18px' direction='row' alignItems='center' flexWrap='noWrap'>
                            <i className="bi bi-caret-left-fill" style={{color: '#333', backgroundColor: '#eee', marginRight: '5px', padding: "6px 6px 5px", borderRadius: '4px' }}></i>
                            <Box></Box>
                            <Stack className='explore_list' id='list' direction='row' alignItems='center' flexWrap='noWrap' style={{overflow: 'auto'}}>
                            <span className='categoryList' style={{margin: '0px 5px', fontSize: '13px', fontWeight: '500', color: '#333', backgroundColor: '#f1f1f1', borderRadius: '10px', border: '1px solid #efefef', padding: '3px 9px'}}>All</span>
                                {/* key starts from 0 */}
                                {postCategoriesContent?.map((element, key) => {
                                    return(
                                        <span className='categoryList' style={{margin: '0px 5px', fontSize: '13px', fontWeight: '500', color: '#333', backgroundColor: '#f1f1f1', borderRadius: '10px', border: '1px solid #efefef', padding: '3px 9px', whiteSpace: 'nowrap'}}>{element}</span>
                                    )
                                })}
                            </Stack>
                            <i onClick={moveRight} className="bi bi-caret-right-fill" style={{color: '#333', backgroundColor: '#eee', marginLeft: '5px', padding: "6px 6px 5px", borderRadius: '4px'}}></i>
                        </Stack>
                        <Stack direction='row' alignItems='center' flexWrap='wrap'>
                            {explorePosts?.map((post) => {
                                return(
                                    <ProfilePost data={post} currentUser={currentUser} id={post?.id}/>
                                )
                            })}
                        </Stack>
                    </Box>
                </Box>
            </div>

            {notificationModalDisplay?.open == true &&
                <NotificationModal content={notificationModalDisplay?.content} type={currentSelect} setNotificationModalDisplay={setNotificationModalDisplay}/>
            }
        </>
    )
}

export default Explore
