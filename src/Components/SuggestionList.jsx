import React, { useContext, useEffect, useState } from 'react'
import {Avatar, Stack} from '@mui/material'
import { db } from '../firebase'
import { userDataContext } from '../App'
import firebase from 'firebase/compat/app'
import { arrayUnion, arrayRemove } from 'firebase/firestore'
import '../stylesheets/rightSideBar.css'

const SuggestionList = ({suggestionId}) => {
    const {currentUserProfileData, setAlertDisplay} = useContext(userDataContext)
    const [suggestionIdDetails, setSuggestionIdDetails] = useState({})
    useEffect(() => {
        db.collection('usersData').doc(suggestionId).onSnapshot(doc => {
            setSuggestionIdDetails(doc.data())
        })
    })

    const sendFollowRequest = () => {
        db.collection('usersData').doc(suggestionIdDetails?.username).update({requests:  
            arrayUnion(
                {
                    reqUsername: currentUserProfileData?.username,
                    reqFullname: currentUserProfileData?.fullname,
                    reqProfilePic: currentUserProfileData?.profilePic
                }
            )
        }
        )
        .then(setAlertDisplay
            ({
                status: 'success',
                msg: 'sent friend request',
                open: true
            }))
        .catch(error => setAlertDisplay({
            status: 'error',
            msg: error,
            open: true
        }))
    }

    const deleteFollowRequest = () => {
        db.collection('usersData').doc(suggestionIdDetails?.username).update({
            requests: firebase.firestore.FieldValue.arrayRemove({
                reqUsername: currentUserProfileData?.username,
                reqFullname: currentUserProfileData?.fullname,
                reqProfilePic: currentUserProfileData?.profilePic
            })
        })
        .then(setAlertDisplay
            ({
                status: 'success',
                msg: 'Friend request reverted',
                open: true
            }))
    }

  return (
    <>
        {/* .some only work with == */}
        {currentUserProfileData?.following?.some(acc => acc.followingUsername == suggestionIdDetails?.username) ?
            ''
            : 
            currentUserProfileData?.username != suggestionIdDetails?.username &&
            <Stack className='friendReqAvatar' direction='row' alignItems='center'>
                <Avatar src={suggestionIdDetails?.profilePic} alt={suggestionIdDetails?.fullname}/>
                <Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>  
                    <Stack className='detailsLeft'>
                    <p className='friendReqUsername'>{suggestionIdDetails?.username}</p>
                    <p className='friendReqFullname'>{suggestionIdDetails?.fullname}</p>
                    </Stack>
                    {suggestionIdDetails?.requests?.some(user => user.reqUsername == currentUserProfileData?.username) ?  
                        <p onClick={deleteFollowRequest} className='postreqBtn btnCursor'>Requested</p>
                        :
                        <p onClick={sendFollowRequest} className='postfollowBtn btnCursor'>Follow</p>
                    }
                </Stack>
            </Stack>
        }
    </>
  )
}

export default SuggestionList