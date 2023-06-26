import React, { useEffect, useState, useContext } from 'react'
import {Box, Stack, Button, Avatar} from '@mui/material'
import {auth, db} from '../firebase'
import ChatUserBox from './ChatUserBox'
import { userDataContext } from '../App'
import '../stylesheets/chatLayout.css'
import Navbar from './Navbar'
import SideBar from './SideBar'
import { generateDocID, encryptData, decryptData } from '../encryptDecryptFunc'
import { arrayUnion, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import ChatUserFinder from './ChatUserFinder'
import { storage } from '../firebase'
import NotificationModal from './NotificationModal'

const Chats = () => {

  const {currentUserProfileData, setNotificationModalDisplay, notificationModalDisplay} = useContext(userDataContext)
  const [chatDetails, setChatDetails] = useState({})
  const [allUsersChat, setAllUsersChat] = useState([])
  const [allUsersData, setAllUsersData] = useState([])
  const [currentChat, setCurrentChat] = useState()
  const [msg, setMsg] = useState('')
  const [chatOpen, setChatOpen] = useState(0)
  const [openAllUsers, setOpenAllUsers] = useState(0)
  const [sendImg, setSendImg] = useState()
  const [sendImgPrev, setSendImgPrev] = useState('')
  const [enlargeImg, setEnlargeImg] = useState(0)
  
  useEffect(() => {
    db.collection('chats').where('sender.username', '==', currentUserProfileData?.username).orderBy("lastChatUpdate", "desc").onSnapshot(snapshot => {
      setAllUsersChat(snapshot.docs.map(doc => {
        return(
          {
            userData: doc.data()
          }
        )
      }))
    })

    db.collection('usersData').onSnapshot(snapshot => {
      setAllUsersData(snapshot.docs.map(doc => {
        return(
          {
            userId: doc.id,
            userData: doc.data()
          }
        )
      }))
    })
  }, [])

  const handleMsg = (event) => {
    setMsg(event.target.value)
  }

  const sendMsg = async(type) => {
    const chatId = await generateDocID(currentUserProfileData?.uid, currentChat?.uid)
    db.collection('chats').doc(chatId).update({
      chats: arrayUnion({
        sender: currentUserProfileData?.username,
        senderProfilePic: currentUserProfileData?.profilePic,
        message: encryptData(msg),
        msgType: type
      }),
      lastChatUpdate: serverTimestamp()
    })

    const chatId2 = await generateDocID(currentChat?.uid, currentUserProfileData?.uid)
    db.collection('chats').doc(chatId2).update({
      chats: arrayUnion({
        sender: currentUserProfileData?.username,
        senderProfilePic: currentUserProfileData?.profilePic,
        message: encryptData(msg),
        msgType: type
      }),
      lastChatUpdate: serverTimestamp()
    })
    .then(async() =>
      {
        setMsg('')
      }
    )
  }

  const closeChat = () => {
    setChatOpen(0)
    setCurrentChat()
  }

  const openList = () => {
    setOpenAllUsers(1)
  }

  useEffect(() => {
    const runUseEffect = async(userData) => {
      console.log('***********************************************************')
      console.log(chatDetails)
        if(chatDetails == undefined){
            console.log("called runUseEffect function")
            console.log(currentChat)
            const chatDocId = await generateDocID(currentUserProfileData?.uid, userData?.uid)
            db.collection('chats').doc(chatDocId).set({
                sender: {
                    username: currentUserProfileData?.username,
                    fullname: currentUserProfileData?.fullname,
                    profilePic: currentUserProfileData?.profilePic
                },
                    
                receiver: {
                    username: currentChat?.username,
                    fullname: currentChat?.fullname,
                    profilePic: currentChat?.profilePic
                },
                    
                chats: [],
                lastChatUpdate: serverTimestamp()
            })

            const chatDocId2 = await generateDocID(userData?.uid, currentUserProfileData?.uid)
            db.collection('chats').doc(chatDocId2).set({
                sender: {
                    username: currentChat?.username,
                    fullname: currentChat?.fullname,
                    profilePic: currentChat?.profilePic
                },
                    
                receiver: {
                    username: currentUserProfileData?.username,
                    fullname: currentUserProfileData?.fullname,
                    profilePic: currentUserProfileData?.profilePic
                },
                    
                chats: [],
                lastChatUpdate: serverTimestamp()
            })
          }
    }

    if(currentChat){
        console.log('wait calling runUseEffect function...')
        runUseEffect(currentChat)
      }

    console.log("USE EFFECT CALLED WITH CHAT DETAILS ")
    // console.log(chatDetails)
    console.log(currentChat)
    // console.log(allUsersData)
  }, [currentChat && chatDetails])

  const handleSendImg = (event) => {
    if(event.target.files[0]){
      setSendImg(event.target.files[0])
      setSendImgPrev(URL.createObjectURL(event.target.files[0]))
    }
  }

  const sendImgBtn = (type) => {
    storage.ref(`chats/${currentUserProfileData?.username}/${sendImg?.name}`).put(sendImg).then(
      (snapshot) => {
        storage.ref(`chats/${currentUserProfileData?.username}`)
        .child(sendImg?.name)
        .getDownloadURL()
        .then(async(url) => {
          let generateId1 = await generateDocID(currentUserProfileData?.uid, currentChat?.uid)
          db.collection('chats').doc(generateId1).update({
            chats: arrayUnion({
              msgType: type,
              sender: currentUserProfileData?.username,
              senderProfilePic: currentUserProfileData?.profilePic,
              message: encryptData(url)
            }),
            lastChatUpdate: serverTimestamp()
          })

          const chatId2 = await generateDocID(currentChat?.uid, currentUserProfileData?.uid)
          db.collection('chats').doc(chatId2).update({
            chats: arrayUnion({
              sender: currentUserProfileData?.username,
              senderProfilePic: currentUserProfileData?.profilePic,
              message: encryptData(url),
              msgType: type
            }),
            lastChatUpdate: serverTimestamp()
          })
          .then(() =>
            {
              setSendImg()
              setSendImgPrev('')
            }
          )
        })
      }
    )
  }

  // console.log(allUsersData)
  console.log(currentChat)
  console.log(chatDetails)
      
  return (
    <>
      <Navbar/>
      {/* friends list */}
      <Stack direction='row' height='calc(100vh - 60px)' width='100vw' style={{overflow: 'hidden', backgroundColor: '#fff'}}>
        {/* sidebar */}
        <Box width='18%'>
          <SideBar currentUsername={currentUserProfileData?.username} setNotificationModalDisplay={setNotificationModalDisplay}/>
        </Box>

        <Stack direction='row' width='82%' p='20px 85px' backgroundColor='#fafafa'>
          <Stack direction='row' backgroundColor='#fff' height='100%' width='100%' border='1px solid #ddd' borderRadius='5px'>
            <Box width='35%' height='100%' borderRight='1px solid #aaa'>
              <Stack py='17px' borderBottom='1px solid #ddd' alignItems='center' justifyContent='center'>
                <p className='senderHeading'>{currentUserProfileData?.username}</p>
              </Stack>

              <Box className='friendsList' py='7px' height='calc(100% - 56px)'>
                {allUsersData?.map(user => {
                  return(
                    allUsersChat?.map((chat) => chat.userData.receiver.username == user?.userData?.username &&
                      <ChatUserBox 
                        userData={user?.userData} 
                        setCurrentChat={setCurrentChat} 
                        currentChat={currentChat}
                        chatDetails={chatDetails}
                        setChatDetails={setChatDetails}
                        setChatOpen={setChatOpen}
                        setOpenAllUsers={setOpenAllUsers}
                        padding='10px 23px'
                        allUsersData={allUsersData}
                      />
                    ) 
                  )
                })}
              </Box>
            </Box>

            {/* chatbox */}

            <Box width='65%' height='100%' >
              {(currentChat && chatOpen == 1)?
                <Stack width='100%' height='100%'>
                  <Stack py='17px' borderBottom='1px solid #ddd' alignItems='center' justifyContent='center' position='relative'>
                    <Link to={`/user/${currentChat?.username}`} style={{textDecoration: 'none', color: '#111'}}>
                      <p className='senderHeading'>{currentChat?.username}</p>
                    </Link>
                    <i onClick={closeChat} className='bi bi-x chatCloseBtn'></i>
                  </Stack>

                  {sendImgPrev == '' ? 
                    <Stack className='msgBox' p='20px' height='100%' style={{overflow: 'hidden auto'}}>
                      {chatDetails?.chats?.map(chat => {
                        return(
                          <Stack mt='9px' width='100%' direction='row' alignItems='center' spacing={1.1} justifyContent={chat?.sender == currentUserProfileData?.username ? 'flex-end' : 'flex-start'}>
                            {chat?.msgType == 'text' &&
                              <p className='msgTextStyle' style={{backgroundColor: '#efefef'}}>{decryptData(chat.message)}</p>
                            }
                            {chat?.msgType == 'image' &&
                              <img onClick={() => {
                                setSendImgPrev(decryptData(chat?.message))
                                setEnlargeImg(1)
                              }} src={decryptData(chat?.message)} style={{width: '200px', height: '200px', objectFit: 'cover', objectPosition: 'center', borderRadius: '20px'}}/>
                            }
                            {chat?.msgType == 'post' &&
                              <Box width='200px' style={{borderRadius: '20px', backgroundColor: '#f9f9f9'}}>
                                <Stack p='10px' direction='row' alignItems='center' spacing={1.3}>
                                  <Avatar sx={{width: '25px', height: '25px'}} src={chat?.postUserAvatar} alt='profilePic'/>
                                  <p className='postUsername'>{chat?.postUsername}</p>
                                </Stack>
                                <img src={decryptData(chat?.message)} style={{width: '200px', height: '200px', objectFit: 'cover', objectPosition: 'center'}}/>
                                <p className='postCaption'><span style={{fontWeight: '500'}}>{chat?.postUsername}</span> {chat?.postCaption}</p>
                              </Box>
                            }
                          </Stack>
                        )
                      })}
                    </Stack>
                    :
                    <Stack className='prevSection' alignItems='center' justifyContent='center'>
                      <img src={sendImgPrev} className='sendImgPrev'/>
                      {enlargeImg === 0 &&
                        <button onClick={() => sendImgBtn('image')} className='sendImgBtn'>send</button>
                      }
                      <button onClick={() => {
                        setSendImgPrev('')
                        setEnlargeImg(0)
                        }} className='closePrevBtn bi bi-x'></button>
                    </Stack>
                  }
                  <Stack style={{display: sendImgPrev != '' && 'none'}} direction='row' px='20px' py='15px' spacing={1} alignItems='center' justifyContent='center'> 
                    <input onChange={handleMsg} onKeyUp={(key) => {
                      if(key.code == 'Enter' && msg != ''){
                        sendMsg('text')
                      }
                    }} className='msgInputBox' type='text' placeholder='Message...' value={msg}/>
                    {msg == '' ?
                      <button disabled onClick={() => sendMsg('text')} className='sendMsgBtn'>Send</button>
                    :
                      <button onClick={() => sendMsg('text')} className='sendMsgBtn'>Send</button>
                    }
                    <label htmlFor='sendImg' className='bi bi-image sendMsgBtn' style={{paddingTop: '8px', fontSize: '17px'}}></label>
                    <input onChange={handleSendImg} type='file' id='sendImg' accept='image/*' style={{display: 'none'}}/>
                  </Stack>
                </Stack>
                : 
                <Stack width='100%' height='100%' backgroundColor='#fdfdfd' alignItems='center' justifyContent='center'>
                  <i class="bi bi-chat-left-text msgIcon"></i>
                  <p className='text1'>Your messages</p>
                  <p className='text2'>Send private photos and messages to a friend or group.</p>
                  <p onClick={openList} className='text3'>Select a friend to start the chat</p>
                </Stack>
              }

            </Box>
          </Stack>
        </Stack>
      </Stack>

      {openAllUsers == 1 &&
        <ChatUserFinder 
          allUsersData={allUsersData} 
          setOpenAllUsers={setOpenAllUsers}
          setCurrentChat={setCurrentChat} 
          currentChat={currentChat}
          chatDetails={chatDetails}
          setChatDetails={setChatDetails}
          setChatOpen={setChatOpen}
        />
      }

      {notificationModalDisplay?.open == true &&
        <NotificationModal content={notificationModalDisplay?.content} type={notificationModalDisplay?.type} totalNotifications={notificationModalDisplay?.content?.length} setNotificationModalDisplay={setNotificationModalDisplay}/>
      }
    </>
  )
}

export default Chats