import React, { useContext, useEffect, useState } from 'react'
import {Stack, Box, Avatar, Button, Backdrop} from '@mui/material'
import SinglePost from './SinglePost'
import '../stylesheets/userProfile.css'
import { db } from '../firebase'
import { userDataContext } from '../App'
import ReactPlayer from 'react-player'

const LikedPostsBox = ({id}) => {

    const {currentUser} = useContext(userDataContext)
    const [likePostData, setLikePostData] = useState({})
    const [display, setDisplay] = useState(false)
    const [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState([])
    const [isLike, setIsLike] = useState(false)

    const openImg = () => {
        setDisplay(true)
    }

    useEffect(() => {
        db.collection('posts').doc(id).onSnapshot(doc => {
            setLikePostData(doc.data())
        })
    }, [])

    console.log(likePostData)

  return (
    <>
        <Box className='imgBox'>
            {likePostData?.imageUrl?.[0]?.type?.includes('image') ?
                <img className='postPreviews' src={likePostData?.imageUrl?.[0]?.url} alt="Post"/>
                :
                <ReactPlayer width='100%' height='100%' url={likePostData?.imageUrl?.[0]?.url} style={{backgroundColor: '#e9e9e9'}}/>
            }
                                    
            <Box onClick={openImg} className='hoverBox'> </Box>

            {likePostData ? 
                <Box className='imageLike_comment'>
                    <Stack m='auto' width='max-content' direction='row' alignItems='center' spacing={3.5}>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <p className='bi bi-heart-fill' style={{fontSize: '20px'}}></p>
                            <p className='fontType' style={{fontSize: '16px', fontWeight: '600'}}>{likePostData?.likes}</p>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <p className='bi bi-chat-right-text-fill' style={{fontSize: '20px'}}></p>
                            <p className='fontType' style={{fontSize: '16px', fontWeight: '600'}}>1k</p>
                        </Stack>
                    </Stack>
                </Box>
            :
                <p style={{fontWeight: '500', position: 'absolute', top: '50%', padding: '0px 13px', textAlign:'center', fontSize: '14px'}}>Post is unavailable or has been deleted by account holder</p>
            }

            <Box className='imageCaption'>
                <p className='imageCaptionText' style={{textAlign: likePostData?.caption?.length < 35 && 'center'}}>{likePostData?.caption}</p>
            </Box>

            {/* enlarge post */}
            {display == true && 
                <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <SinglePost
                        id={id}
                        imageUrl={likePostData?.imageUrl}
                        caption={likePostData?.caption}
                        username={likePostData?.username}
                        likes={likePostData?.likes}
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

export default LikedPostsBox