import React, { useContext } from 'react'
import {Box, Stack, Backdrop, Avatar} from '@mui/material'
import '../stylesheets/modal.css'
import FriendRequestList from './FriendRequestList'
import { userDataContext } from '../App'

const Modal = ({open, heading, content, setModalDisplay}) => {
    const {currentUserProfileData} = useContext(userDataContext)
    const closeModalDisplay = () => {
        setModalDisplay({
            open: false,
            heading: '',
            content: []
        })
    }
  return (
    <>
        <Backdrop open={open} sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Box className='mainContainer'>
                <Stack py='13px' alignItems='center' justifyContent='space-evenly' borderBottom='1px solid #ddd'>
                    <p className='heading'>{heading}</p>
                </Stack>

                {content?.length > 0 ?
                    content?.map((list) => {
                        if(list.hasOwnProperty('followerUsername') || list.hasOwnProperty('followingUsername'))
                        {
                            return(
                                <Stack mt='10px' pr='5px' direction='row' alignItems='center' px='20px'>
                                    <Avatar src={list.hasOwnProperty('followerProfilePic') ? list.followerProfilePic : list.followingProfilePic} alt={list.hasOwnProperty('followerFullname') ? list.followerUsername : list.followingFullname}/>
                                    
                                    <Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>
                                        
                                        <Stack ml='12px'>
                                        <p className='fontType' style={{fontSize: '15px', color: '#111', fontWeight: '600'}}>{list.hasOwnProperty('followerUsername') ? list.followerUsername : list.followingUsername}</p>
                                        <p className='fontType' style={{fontSize: '12.5px', color: '#777'}}>{list.hasOwnProperty('followerFullname') ? list.followerFullname : list.followingFullname}</p>
                                        </Stack>
        
                                        {/* {currentUserProfileData?.following?.some(user => user.followingUsername == username) ? 
                                            <p className='postfollowingBtn fontType'>Following</p>
                                            :
                                            postUsernameProfileData?.requests?.some(user => user.reqUsername == currentUserProfileData?.username) ? 
                                            <p  className='postreqBtn fontType'>Requested</p>
                                            :
                                            <p  className='postfollowBtn fontType'>Follow</p>
                                        } */}
                                        <p className='postfollowingBtn fontType'>Following</p>
                                    </Stack>
                                </Stack>
                            )
                        }
                        else if(list.hasOwnProperty('reqUsername'))
                        {
                            return(
                                <Box px='20px'>
                                    <FriendRequestList reqFullname={list.reqFullname} reqUsername={list.reqUsername} reqProfilePic={list.reqProfilePic} currentUserProfileData={currentUserProfileData}/>
                                </Box>
                            )
                        }
                    })
                    :
                    <Box>
                        <p className='noContent'>nothing to show yet !!</p>
                    </Box>
                }

                <i onClick={closeModalDisplay} className="bi bi-x modalCloseBtn"></i>
            </Box>
        </Backdrop>
    </>
  )
}

export default Modal