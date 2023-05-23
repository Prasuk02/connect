import React, {useEffect, useState} from 'react'
import {Avatar, Box, Button, Stack} from '@mui/material'
import '../stylesheets/rightSideBar.css'
import FriendRequestList from './FriendRequestList'
import Modal from './Modal'
import SuggestionList from './SuggestionList'
import { db } from '../firebase'

const RightSideBar = ({username, currentUserProfileData}) => {
  const [suggestionList, setSuggestionList] = useState([])
  const [modalDisplay, setModalDisplay] = useState({
    open: false,
    heading: '',
    content: []
  })

  useEffect(() => {
    db.collection('usersData').onSnapshot(snapshot => {
      setSuggestionList(snapshot.docs.map(doc => {
        return({
          docId: doc.id
        })
      }))
    })
  }, [])

  console.log(suggestionList)

  const showReq = () => {
    setModalDisplay({
      open: true,
      heading: 'Friend Requests',
      content: currentUserProfileData?.requests
    })
  }

  console.log(currentUserProfileData?.requests)
  return (
    <>
        <Box mt='15px' p='20px' backgroundColor='white' borderRadius='6px'>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Avatar src={currentUserProfileData?.profilePic}
                      alt={currentUserProfileData?.fullname}
                      />
              <Stack>
                <p className='profileName'>{username}</p>
                <p className='profileFullname'>{currentUserProfileData?.fullname}</p>
              </Stack>
            </Stack>
            <Stack mt='12px' px='5px' direction='row' justifyContent='space-between' alignItems='center'>
                {/* no. of posts */}
                <Stack alignItems='center'>
                  <p className='fontType' style={{fontSize: '15px', color: '#222', fontWeight: '600'}}>Posts</p>
                  <p className='fontType' style={{fontSize: '14px', color: '#666'}}>10</p>
                </Stack>
                {/* no. of followers */}
                <Stack alignItems='center' ml='5px'>
                  <p className='fontType' style={{fontSize: '15px', color: '#222', fontWeight: '600'}}>Followers</p>
                  <p className='fontType' style={{fontSize: '14px', color: '#666'}}>{currentUserProfileData?.followers?.length}</p>
                </Stack>
                {/* no. of comments */}
                <Stack alignItems='center'>
                  <p className='fontType' style={{fontSize: '15px', color: '#222', fontWeight: '600'}}>Following</p>
                  <p className='fontType' style={{fontSize: '14px', color: '#666'}}>{currentUserProfileData?.following?.length}</p>
                </Stack>
            </Stack>
        </Box>


        {/* FRIEND REQUEST */}
      <Box  style={{position: 'sticky', top: '75px'}}>
        <Box mt='15px' p='15px 20px' backgroundColor='white' borderRadius='6px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <p className='sidebarHeading'>Friend Requests</p>
              <p onClick={showReq} className='profileFullname'>see all</p>
            </Stack>

            <Box mt='8px' borderTop='1px solid #ddd'></Box>

            {currentUserProfileData?.requests?.slice(0).reverse().map((req) => {
              return(
                <FriendRequestList reqFullname={req.reqFullname} reqUsername={req.reqUsername} reqProfilePic={req.reqProfilePic} currentUserProfileData={currentUserProfileData}/>
              )
            })}
        </Box>


        {/* SUGGESTIONS */}
        <Box mt='15px' p='15px 20px' backgroundColor='white' borderRadius='6px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <p className='sidebarHeading'>Suggestions</p>
              <p className='profileFullname'>see all</p>
            </Stack>

            <Box mt='8px' borderTop='1px solid #ddd'></Box>

            {suggestionList?.map(suggestionId => {
              return(
                <SuggestionList suggestionId={suggestionId.docId}/>
              )
            })}
        </Box>
      </Box>


      {modalDisplay.open == true &&
        <Modal 
          open={modalDisplay?.open} 
          heading={modalDisplay?.heading} 
          content={modalDisplay?.content}
          setModalDisplay={setModalDisplay}  
        />
      }
    </>
  )
}

export default RightSideBar