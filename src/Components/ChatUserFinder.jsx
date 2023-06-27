import React, { useContext, useState } from 'react'
import { Backdrop, Box, Stack, Avatar} from '@mui/material'
import '../stylesheets/chatUserFinder.css'
import ChatUserBox from './ChatUserBox'
import { userDataContext } from '../App'

const ChatUserFinder = ({allUsersData, setOpenAllUsers, setCurrentChat, currentChat, chatDetails, setChatDetails, setChatOpen}) => {

    const [searchProfileText, setSearchProfileText] = useState('')
    const {currentUserProfileData} = useContext(userDataContext)

    const closeList = () => {
        setOpenAllUsers(0)
    }

    const searchProfile = (event) => {
        setSearchProfileText(event.target.value)
    }

  return (
    <>
        <Backdrop open={open} sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Box className='mainContainer' p='0px'>
                <Stack py='14px' alignItems='center' justifyContent='space-evenly' borderBottom='1px solid #ddd'>
                    <p className='heading' style={{fontSize: '15px'}}>New Message</p>
                </Stack>

                <Stack px='15px' py='4px' direction='row' alignItems='flex-start' justifyContent='flex-start' borderBottom='1px solid #ddd'>
                    <p style={{fontWeight: '600', fontSize: '14px', paddingTop: '7px'}}>To:</p>
                    <input onChange={searchProfile} className='searchInputBoxModal' type='text' placeholder='Search'/>
                </Stack>

                <Box p='10px 0px' style={{height: '296px', overflow: 'hidden auto'}}>
                    {allUsersData?.map(element => {
                        return(
                            ((element?.userId?.toLowerCase().includes(searchProfileText.toLowerCase()) || element?.userData?.fullname?.toLowerCase().includes(searchProfileText.toLowerCase())) && (element?.userId != currentUserProfileData?.username)) &&
                            <ChatUserBox
                                userData={element?.userData} 
                                setCurrentChat={setCurrentChat} 
                                currentChat={currentChat}
                                chatDetails={chatDetails}
                                setChatDetails={setChatDetails}
                                setChatOpen={setChatOpen}
                                setOpenAllUsers={setOpenAllUsers}
                                padding='8px 23px'
                                allUsersData={allUsersData}
                            />
                        )
                    })}
                </Box>

                <i onClick={closeList} className="bi bi-x modalCloseBtn"></i>
            </Box>
        </Backdrop>
    </>
  )
}

export default ChatUserFinder