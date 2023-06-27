import React, { useEffect, useState } from 'react'
import {Stack, Box, Avatar, Button, Backdrop} from '@mui/material'
import SinglePost from './SinglePost'
import '../stylesheets/userProfile.css'
import ReactPlayer from 'react-player'
import {IoIosPhotos} from 'react-icons/io'
import { db } from '../firebase'

const ProfilePost = ({data, currentUser, id}) => {
    const [display, setDisplay] = useState(false)
    const [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState([])
    const [isLike, setIsLike] = useState(false)
    const [totalComments, setTotalComments] = useState([])

    const openImg = () => {
        console.log('clicked')
        setDisplay(true)
    }

    useEffect(() => {
        db.collection('posts').doc(id).collection('comments').onSnapshot((snapshot) => {
            setTotalComments(snapshot.docs.map((doc) => {
                doc.id
            }))
        })
    }, [])

    console.log(data)
  return (
    <>
        <Box className='imgBox'>
            {data?.postData?.imageUrl?.[0]?.type?.includes('image') ?
                <img className='postPreviews' src={data?.postData?.imageUrl?.[0]?.url} alt="Post"/>
                :
                <ReactPlayer width='100%' height='100%' url={data?.postData?.imageUrl?.[0]?.url} style={{backgroundColor: '#e9e9e9'}}/>
            }
                                    
            <Box onClick={openImg} className='hoverBox'> </Box>

            {data?.postData?.imageUrl.length > 1 &&
                <IoIosPhotos style={{position: 'absolute', top: '10px', right: '13px', color: 'white', width: '20px', height: '20px', transform: 'scale(-1)'}}/>
            }

            <Box className='imageLike_comment'>
                <Stack m='auto' width='max-content' direction='row' alignItems='center' spacing={3.5}>
                    <Stack className='btnNoCursor' direction='row' alignItems='center' spacing={1}>
                        <p className='bi bi-heart-fill' style={{fontSize: '20px'}}></p>
                        <p style={{fontSize: '16px', fontWeight: '600'}}>{data?.postData?.likes}</p>
                    </Stack>
                    <Stack className='btnNoCursor' direction='row' alignItems='center' spacing={1}>
                        <p className='bi bi-chat-right-text-fill' style={{fontSize: '20px'}}></p>
                        <p style={{fontSize: '16px', fontWeight: '600'}}>{totalComments?.length}</p>
                    </Stack>
                </Stack>
            </Box>

            <Box className='imageCaption'>
                <p className='imageCaptionText' style={{textAlign: data.postData.caption.length < 35 && 'center'}}>{data?.postData?.caption}</p>
            </Box>

            {/* enlarge post */}
            {display == true && 
                <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <SinglePost
                        id={id}
                        imageUrl={data?.postData?.imageUrl}
                        caption={data?.postData?.caption}
                        username={data?.postData?.username}
                        likes={data?.postData?.likes}
                        currentUsername={currentUser?.displayName}
                        setDisplay={setDisplay}
                        isLike={isLike}
                        setIsLike={setIsLike}
                        comment={comment}
                        setComment={setComment}
                        commentList={commentList}
                        setCommentList={setCommentList}
                    />
                </Backdrop>
            }
        </Box>
    </>
  )
}

export default ProfilePost