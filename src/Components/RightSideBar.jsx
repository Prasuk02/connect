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
        <Box className='rightSideMainBox'>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Avatar src={currentUserProfileData?.profilePic}
                        alt={currentUserProfileData?.fullname}
                        />
                <Stack>
                  <p className='profileName'>{username}</p>
                  <p className='profileFullname'>{currentUserProfileData?.fullname}</p>
                </Stack>
              </Stack>
              <Stack className='rightSidebarUserDetails' direction='row' justifyContent='space-between' alignItems='center'>
                  {/* no. of posts */}
                  <Stack alignItems='center'>
                    <p className='rightUserDetailHeading'>Posts</p>
                    <p className='rightUserDetail'>10</p>
                  </Stack>
                  {/* no. of followers */}
                  <Stack alignItems='center' ml='5px'>
                    <p className='rightUserDetailHeading'>Followers</p>
                    <p className='rightUserDetail'>{currentUserProfileData?.followers?.length}</p>
                  </Stack>
                  {/* no. of comments */}
                  <Stack alignItems='center'>
                    <p className='rightUserDetailHeading'>Following</p>
                    <p className='rightUserDetail'>{currentUserProfileData?.following?.length}</p>
                  </Stack>
              </Stack>
          </Box>


          {/* FRIEND REQUEST */}
        <Box style={{position: 'sticky', top: '75px'}}>
          <Box className='rightSideMainBox' >
              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <p className='sidebarHeading'>Friend Requests</p>
                <p onClick={showReq} className='profileFullname'>see all</p>
              </Stack>

              <Box className='boxDivider'></Box>

              {currentUserProfileData?.requests?.slice(0).reverse().map((req) => {
                return(
                  <FriendRequestList reqFullname={req.reqFullname} reqUsername={req.reqUsername} reqProfilePic={req.reqProfilePic} currentUserProfileData={currentUserProfileData}/>
                )
              })}
          </Box>


          {/* SUGGESTIONS */}
          <Box className='rightSideMainBox'>
              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <p className='sidebarHeading'>Suggestions</p>
                <p className='profileFullname'>see all</p>
              </Stack>

              <Box className='boxDivider'></Box>

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