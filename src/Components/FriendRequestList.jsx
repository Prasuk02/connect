import React, { useContext } from 'react'
import {Avatar, Stack} from '@mui/material'
import '../stylesheets/rightSideBar.css'
import { db } from '../firebase'
import { arrayUnion, arrayRemove } from 'firebase/firestore'
import firebase from 'firebase/compat/app';
import { Link } from 'react-router-dom'
import { userDataContext } from '../App'

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
        <Stack mt='15px' pr='5px' direction='row' alignItems='center'>
            <Link to={`/user/${reqUsername}`} style={{textDecoration:'none'}}>
                <Avatar src={reqProfilePic} alt={reqFullname}/>
            </Link>
            <Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>
                <Link to={`/user/${reqUsername}`} style={{textDecoration:'none'}}>
                    <Stack ml='20px'>
                        <p className='fontType' style={{fontSize: '14px', color: '#111', fontWeight: '600'}}>{reqUsername}</p>
                        <p className='fontType' style={{fontSize: '14px', color: '#777'}}>{reqFullname}</p>
                    </Stack>
                </Link>

                <Stack direction='row' spacing={1} alignItems='center'>
                    <i onClick={acceptReq} class="bi bi-check2" style={{backgroundColor: '#71ffbd55', color: '#198754', fontSize: '23px', padding: '0px 5px 4px', borderRadius: '5px'}}></i>
                    <i onClick={deleteReq} class="bi bi-x" style={{backgroundColor: '#dc354535', color: '#dc3545', fontSize: '23px', padding: '0px 5px 4px', borderRadius: '5px'}}></i>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default FriendRequestList