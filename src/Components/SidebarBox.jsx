import React, {useContext, useEffect, useState} from 'react'
import { Box, Stack, Avatar, Badge} from '@mui/material'
import { userDataContext } from '../App'
import { Link, useNavigate } from 'react-router-dom'
import '../stylesheets/sidebar.css'

const SidebarBox = ({element, currentUsername, setNotificationModalDisplay}) => {
    const {currentUserProfileData, currentSelect, setCurrentSelect} = useContext(userDataContext)
    const {createPostDisplay, setCreatePostDisplay} = useContext(userDataContext)
    const [totalNotifications, setTotalNotifications] = useState(0)
    const [readNotifications, setReadNotifications] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        setTotalNotifications(currentUserProfileData?.notification?.length)

    }, [])
    
    const menuClick = () => {
        if(element.name == 'Notifications')
        {
            console.log(element.name)
            setNotificationModalDisplay({
                open: true,
                content: currentUserProfileData?.notification,
                type: 'Notifications'
            })
        }

        if(element.name == 'Search'){
            setNotificationModalDisplay({
                open: true,
                content: currentUserProfileData?.notification,
                type: 'Search'
            })
        }

        if(element.name == 'Messages'){
            navigate('/chats')
        }

        if(element.name == "Home"){
            navigate('/home')
        }

        if(element.name == 'Create'){
            setCreatePostDisplay({
                open: 'true'
            })
            navigate('/home')
        }

        if(element.name == 'Explore'){
            navigate('/explore')
        }

        setCurrentSelect(element.name)
    }
  return (
    <>
        <Box className='sidebox' style={{backgroundColor: currentSelect == element.name && '#f6f6f6', borderRadius: '10px'}}>
            {element.name !== 'Profile' ? 
                element.name != 'Notifications' ?
                    <Stack onClick={menuClick} direction='row' alignItems='center' spacing={2.3} pt='6px' pb='14px' pl='12px' borderRadius='10px'>
                        {/* <p style={{color: '#262626', fontSize: '27px', paddingTop: '7px'}}>{element.icon}</p> */}
                        <p className={element.icon} style={{color: '#262626', fontSize: '24px'}}></p>
                        <p style={{color: '#262626', fontSize: '15px', paddingTop: '5px'}}>{element.name}</p>
                    </Stack>
                    :
                    <Stack onClick={menuClick} direction='row' alignItems='center' spacing={2.3} pt='6px' pb='14px' pl='12px' borderRadius='10px' position='relative'>
                        {/* <p style={{color: '#262626', fontSize: '27px', paddingTop: '7px'}}>{element.icon}</p> */}
                        <p className={element.icon} style={{color: '#262626', fontSize: '24px'}}></p>
                        <p style={{color: '#262626', fontSize: '15px', paddingTop: '5px'}}>{element.name}</p>
                        <Badge color="error" badgeContent={totalNotifications}  style={{position: 'absolute', top: '9px', left: '21px'}}>
                        </Badge>
                    </Stack>
            : 
            <Link to={`/user/${currentUsername}`} style={{textDecoration: 'none'}}>
                <Stack onClick={menuClick} direction='row' alignItems='center' spacing={2} pt='14px' pb='14px' pl='8px' borderRadius='10px'>
                    {/* <p style={{color: '#262626', fontSize: '27px', paddingTop: '7px'}}>{element.icon}</p> */}
                    <Avatar style={{backgroundColor: '#E9E9E9', width: '31px', height: '31px'}}
                        src={currentUserProfileData?.profilePic}
                        alt={currentUserProfileData?.fullname}
                    />
                    <p style={{color: '#262626', fontSize: '15px'}}>{currentUsername}</p>
                </Stack>
            </Link>
            }
        </Box>
    </>
  )
}

export default SidebarBox