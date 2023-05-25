import React, { useContext } from 'react'
import {Avatar, Stack} from '@mui/material'
import '../stylesheets/rightSideBar.css'
import { db } from '../firebase'
import { arrayUnion, arrayRemove } from 'firebase/firestore'
import firebase from 'firebase/compat/app';
import { Link } from 'react-router-dom'
import { userDataContext } from '../App'
import '../stylesheets/rightSideBar.css'

const FriendRequestList = ({reqFullname, reqUsername, currentUserProfileData, reqProfilePic}) => {
    const {alertDisplay, setAlertDisplay} = useContext(userDataContext)
    const acceptReq = () => {
        db.collection('usersData').doc(currentUserProfileData?.username).update({
          followers: arrayUnion(
            {
            //   profilePic: ,
              followerUsername: reqUsername,
              followerFullname: reqFullname,
              followerProfilePic: reqProfilePic
            }
          )
        })

        db.collection('usersData').doc(currentUserProfileData?.username).update({
            requests: firebase.firestore.FieldValue.arrayRemove({
                reqUsername: reqUsername,
                reqFullname: reqFullname,
                reqProfilePic: reqProfilePic
            })
        })

        db.collection('usersData').doc(reqUsername).update({
            following: arrayUnion({
                followingUsername: currentUserProfileData?.username,
                followingFullname: currentUserProfileData?.fullname,
                followingProfilePic: currentUserProfileData?.profilePic
            })
        })
        .then(setAlertDisplay({
            status: 'success',
            msg: `${reqUsername} friend request has been accepted`,
            open: true
        }))
    }

    const deleteReq = () => {
        console.log('called deleteRec function')
        db.collection('usersData').doc(currentUserProfileData?.username).update({
            requests: firebase.firestore.FieldValue.arrayRemove({
                reqUsername: reqUsername,
                reqFullname: reqFullname,
                reqProfilePic: reqProfilePic
            })
        })
    }

    return (
        <Stack className='friendReqAvatar' direction='row' alignItems='center'>
            <Link to={`/user/${reqUsername}`} style={{textDecoration:'none'}}>
                <Avatar src={reqProfilePic} alt={reqFullname}/>
            </Link>
            <Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>
                <Link to={`/user/${reqUsername}`} style={{textDecoration:'none'}}>
                    <Stack className='detailsLeft'>
                        <p className='friendReqUsername'>{reqUsername}</p>
                        <p className='friendReqFullname'>{reqFullname}</p>
                    </Stack>
                </Link>

                <Stack direction='row' spacing={1} alignItems='center'>
                    <i onClick={acceptReq} class="bi bi-check2 acceptRejectBox" style={{backgroundColor: '#71ffbd55', color: '#198754'}}></i>
                    <i onClick={deleteReq} class="bi bi-x acceptRejectBox" style={{backgroundColor: '#dc354535', color: '#dc3545'}}></i>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default FriendRequestList