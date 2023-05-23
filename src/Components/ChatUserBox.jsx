import React, { useContext, useEffect, useState } from 'react'
import {Box, Stack, Avatar} from '@mui/material'
import { userDataContext } from '../App'
import {decryptData, encryptData, generateDocID} from '../encryptDecryptFunc'
import {db} from '../firebase'
import '../stylesheets/chatLayout.css'
import { serverTimestamp } from 'firebase/firestore'

const ChatUserBox = ({userData, setCurrentChat, currentChat, chatDetails, setChatDetails, setChatOpen, setOpenAllUsers, padding, allUsersData}) => {
    
    const {currentUserProfileData} = useContext(userDataContext)
    const [lastMsg, setLastMsg] = useState('')

    const openChat = async() => {
        // console.log(userData)
        const chatDocId = await generateDocID(currentUserProfileData?.uid, userData?.uid)
        // console.log(chatDocId)
        db.collection('chats').doc(chatDocId).onSnapshot(doc => {
            setChatDetails(doc.data())
        }) 
        setChatOpen(1)
        setCurrentChat(userData)
        setOpenAllUsers(0)
    }

    // useEffect(() => {
    //     const getLastMsg = async() => {
    //     const chatId = await generateDocID(currentUserProfileData?.uid, currentChat?.uid)
    //     console.log(chatId)
    //     db.collection('chats').doc(chatId).onSnapshot(doc => {
    //           setLastMsg(doc.data()?.chats?.[doc.data().chats.length - 1]?.message)
    //         })
    //     }  
    // getLastMsg()
    // }, [currentChat])

    return (
        <>
            <Stack className='eachChat' onClick={openChat} p={padding} direction='row' alignItems='center' style={{backgroundColor: currentChat?.username == userData.username ? '#e5e5e5' : ''}}>
                <Avatar src={userData?.profilePic} alt={userData?.fullname} style={{width: '48px', height: '48px'}}/>
                <Stack ml='20px'>
                    <p className='fontType' style={{fontSize: '14px', color: '#111', fontWeight: '600'}}>{userData?.username}</p>
                    <p className='fontType' style={{fontSize: '12px', color: '#777'}}>{userData?.fullname}</p>
                    {/* {lastMsg != '' ?
                        <p className='fontType' style={{fontSize: '12.1px', color: '#333333d5', maxHeight: '18px', overflow: 'hidden', marginTop: '2px'}}>{decryptData(lastMsg)}</p>
                        :
                        <p className='fontType' style={{fontSize: '12px', color: '#333333d5', marginTop: '2px'}}></p>
                    } */}
                </Stack>
            </Stack>
        </>
    )
}

export default ChatUserBox