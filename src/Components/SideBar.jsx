import React, { useContext } from 'react'
import { Box, Stack, Avatar} from '@mui/material'
import { sidebarContent } from '../content/sidebarContent'
import {AiOutlineMenu} from 'react-icons/ai'
import SidebarBox from './SidebarBox'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import '../stylesheets/sidebar.css'

const SideBar = ({currentUsername, setNotificationModalDisplay}) => {
    const navigate = useNavigate()

    const logoutUser = () => {
        auth.signOut().then(() => {
            navigate("/")
        })
    }

  return (
    <>
        <Box className='sideBarMainBox'>
            {sidebarContent?.map((element) => {
                return(
                    <SidebarBox element={element} currentUsername={currentUsername} setNotificationModalDisplay={setNotificationModalDisplay}/>
                )
            })}

            <Stack className='moreBtn' direction='row' alignItems='center' spacing={2.3}>
                <p className='menuIcon'><AiOutlineMenu style={{color: '#262626', fontSize: '27px'}}/></p>
                <p className='moreOptionText sidebarElementName'>More</p>
                <Box className='moreOptions'>
                    <Link to='/posts/saved' style={{textDecoration: 'none'}}>
                        <Stack className='moreOptionsItem' direction='row' alignItems='center' justifyContent='space-between'>
                            <p className='moreOptionText'>Saved</p>
                            <i class= "bi bi-bookmark-fill moreOptionIcon" style={{color: '#222'}}></i>
                        </Stack>
                    </Link>
                    <Link to='/posts/liked' style={{textDecoration: 'none'}}>
                        <Stack className='moreOptionsItem' direction='row' alignItems='center' justifyContent='space-between'>
                            <p className='moreOptionText'>Likes</p>
                            <i class="bi bi-heart-fill moreOptionIcon" style={{color: '#dc3545'}}></i>
                        </Stack>
                    </Link>
                    <Stack onClick={logoutUser} className='moreOptionsItem' direction='row' alignItems='center' justifyContent='space-between'>
                        <p className='moreOptionText'>Logout</p>
                        <i class="bi bi-box-arrow-left moreOptionIcon" style={{color: '#222'}}></i>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    </>
  )
}

export default SideBar
