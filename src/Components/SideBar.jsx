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
        <Box style={{width: '100%', borderRight: '1px solid #eee', height: 'calc(100vh - 60px)', overflowY: 'auto', padding: '20px 20px 20px 20px', backgroundColor: 'white', position: 'sticky', top: '60px'}}>
            {sidebarContent?.map((element) => {
                return(
                    <SidebarBox element={element} currentUsername={currentUsername} setNotificationModalDisplay={setNotificationModalDisplay}/>
                )
            })}

            <Stack className='moreBtn' style={{position: 'relative'}} direction='row' alignItems='center' spacing={2.3} mt='93px' pl='12px' borderRadius='10px'>
                <p><AiOutlineMenu style={{color: '#262626', fontSize: '27px', paddingTop: '7px'}}/></p>
                <p style={{color: '#262626', fontSize: '15.5px'}}>More</p>
                <Box className='moreOptions'>
                    <Link to='/posts/saved' style={{textDecoration: 'none'}}>
                        <Stack className='moreOptionsItem' p='11px 18px' borderBottom='1px solid #ddd' direction='row' alignItems='center' justifyContent='space-between'>
                            <p style={{color: '#262626', fontSize: '15.5px'}}>Saved</p>
                            <i class= "bi bi-bookmark-fill" style={{color: '#222', fontSize: '19px'}}></i>
                        </Stack>
                    </Link>
                    <Link to='/posts/liked' style={{textDecoration: 'none'}}>
                        <Stack className='moreOptionsItem' p='11px 18px' borderBottom='1px solid #ddd' direction='row' alignItems='center' justifyContent='space-between'>
                            <p style={{color: '#262626', fontSize: '15.5px'}}>Likes</p>
                            <i class="bi bi-heart-fill" style={{color: '#dc3545', fontSize: '19px'}}></i>
                        </Stack>
                    </Link>
                    <Stack onClick={logoutUser} className='moreOptionsItem' p='11px 18px' borderBottom='1px solid #ddd' direction='row' alignItems='center' justifyContent='space-between'>
                        <p style={{color: '#262626', fontSize: '15.5px'}}>Logout</p>
                        <i class="bi bi-box-arrow-left" style={{color: '#222', fontSize: '19px'}}></i>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    </>
  )
}

export default SideBar
