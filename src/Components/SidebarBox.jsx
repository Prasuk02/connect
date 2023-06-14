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

        if(element.name == 'Game'){
            navigate('/game')
        }

        setCurrentSelect(element.name)
    }
  return (
    <>
        <Box className='sidebox' style={{backgroundColor: currentSelect == element.name && '#f6f6f6', borderRadius: '10px', paddingRight: '10px'}}>
            {element.name !== 'Profile' ? 
                element.name != 'Notifications' ?
                    <Stack onClick={menuClick} direction='row' alignItems='center' spacing={2.3} pt='6px' pb='14px' pl='12px' borderRadius='10px'>
                        <p className={`${element.icon} sidebarElementIcon`}></p>
                        <p className='sidebarElementName'>{element.name}</p>
                    </Stack>
                    :
                    <Stack onClick={menuClick} direction='row' alignItems='center' spacing={2.3} pt='6px' pb='14px' pl='12px' borderRadius='10px' position='relative'>
                        <p className={`${element.icon} sidebarElementIcon`}></p>
                        <p className='sidebarElementName'>{element.name}</p>
                        <Badge color="error" badgeContent={totalNotifications}  style={{position: 'absolute', top: '9px', left: '21px'}}>
                        </Badge>
                    </Stack>
            : 
            <Link to={`/user/${currentUsername}`} style={{textDecoration: 'none'}}>
                <Stack className='profileStack' onClick={menuClick} direction='row' alignItems='center' spacing={2} pb='14px' pl='8px' borderRadius='10px'>
                    <Avatar style={{backgroundColor: '#E9E9E9', width: '31px', height: '31px'}}
                        src={currentUserProfileData?.profilePic}
                        alt={currentUserProfileData?.fullname}
                    />
                    <p className='sidebarElementName' style={{paddingTop: '0px'}}>{currentUsername}</p>
                </Stack>
            </Link>
            }
        </Box>
    </>
  )
}

export default SidebarBox