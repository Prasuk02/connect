import React, { useState, useEffect } from 'react'
import {Box, Stack, Avatar} from '@mui/material'
import '../stylesheets/notificationModal.css'
import { db } from '../firebase'
import { Link } from 'react-router-dom'

const NotificationModal = ({content, type, setNotificationModalDisplay}) => {
    const [searchUsersList, setSearchUsersList] = useState([])
    const [searchText, setSearchText] = useState('')

    const closeDisplay = () => {
        setNotificationModalDisplay({
            open: false,
            content: [],
            type: 'none'
        })
    }

    const handleSearchText = (event) => {
        setSearchText(event.target.value)
    }

    useEffect(() => {
        if(type == 'Search'){
            db.collection('usersData').onSnapshot(snapshot => {
                setSearchUsersList(snapshot.docs.map(doc => {
                    return(
                        {
                            userId: doc.id,
                            userFullname: doc.data().fullname,
                            userProfilePic: doc.data().profilePic
                        }
                    )
                }))
            })
            }
    }, [])
    console.log(searchUsersList)
  return (
    <>
        <Box className='notifyContainer'>
            <Stack className='textHead' pb='10px' borderBottom='1px solid #ddd'>
                <p className='textHead'>{type == 'Search' ? "Search Profile" : type}</p>
                {type == 'Search' &&
                    <input onChange={handleSearchText} className='searchInputBox' type='text' placeholder='Search'/>
                }
            </Stack>

            <Box>
                {type == 'Notifications' ?
                    content?.slice(0).reverse().map((element) => {
                        return(
                            <Stack mt='10px' direction='row' alignItems='center' justifyContent='space-between'>
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <Avatar src={element.profilePic}/>
                                    <p className='notifyText'><span style={{fontWeight: '600'}}>{element.username} </span>{element.msg}.</p>
                                </Stack>

                                <img class='notifyPost' src={element?.notification?.post[0]?.url}/>
                            </Stack>
                        )
                    })
                    :
                    <Box mt='15px'>
                        {searchUsersList?.map((element) => {
                            return(
                                (searchText != '' && (element?.userId?.toLowerCase().includes(searchText.toLowerCase()) || element?.userFullname?.toLowerCase().includes(searchText.toLowerCase()))) &&
                                <Link to={`/user/${element.userId}`} style={{textDecoration: 'none', color: '#111'}}>
                                    <Stack p='7px 12px' direction='row' alignItems='center'>
                                        <Avatar src={element?.userProfilePic} alt={element?.userFullname} style={{width: '46px', height: '46px'}}/>
                                        <Stack ml='10px'>
                                            <p className='fontType' style={{fontSize: '14px', color: '#111', fontWeight: '600'}}>{element?.userId}</p>
                                            <p className='fontType' style={{fontSize: '13px', color: '#777'}}>{element?.userFullname}</p>
                                        </Stack>
                                    </Stack>
                                </Link>
                            )
                        })
                        }
                    </Box>
                }
            </Box>
            <i onClick={closeDisplay} className="bi bi-x notifyCloseBtn"></i>
        </Box>
    </>
  )
}

export default NotificationModal