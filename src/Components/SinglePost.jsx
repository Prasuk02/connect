import React, { useEffect, useState } from 'react'
import { Box, Avatar, Stack, Snackbar, Alert } from '@mui/material'
import {db} from '../firebase'
import { serverTimestamp } from 'firebase/firestore'
import '../stylesheets/singlePost.css'
import ReactPlayer from 'react-player'
import { emojis } from '../content/sidebarContent'

const SinglePost = ({id, imageUrl, username, caption, likes, currentUsername, setDisplay, isLike, setIsLike, comment, setComment, commentList, setCommentList}) => {
    const [like, setlike] = useState(likes)
    const [alertStatus, setAlertStatus] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    // console.log(`after: ${like}`)
    // console.log(comment?.length)
    console.log(imageUrl)
    useEffect(() => {
        const updateDb = () => {
            console.log(`before: ${like}`)
            db.collection('posts').doc(id).update({
                likes: like
            })
        }
        updateDb()
    }, [like])

    useEffect(() => {
        db.collection('posts').doc(id).collection('comments').orderBy('time', 'desc').onSnapshot(snapshot => {
            setCommentList(snapshot.docs.map((doc) => {
                // console.log(id)
                return(
                    doc.data()
                )
            }))  
        })
    }, [])

    const likeButton = () => {
        const updateLike = () => {
            if(isLike){
                setlike(like-1)
            }
            else{
                setlike(like+1)
            }
            setIsLike(!isLike)
            // setState properly value set jab hota hai jab function khatam ho jata hai
        }
        updateLike()
    }

    const updateDisplay = () => {
        setDisplay(false)
    }

    const handelComment = (event) => {
        setComment(event.target.value)
    }

    const postComment = () => {
        db.collection('posts').doc(id).collection('comments').add({
            username: currentUsername,
            comment: comment,
            time: serverTimestamp()
        }).then(() => {
            setAlertStatus(true)
            setComment('')
        }
        )
    }

    const handelAlert = () => {
        setAlertStatus(false)
    }

    return (
    <>
        {/* sx used instead of style tag when variable is to be passed */}
        <Box className='singlePostMainBox' sx={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'hidden'}}>
            <div className='singlePostStack'>
                {/* photo */}
                <Stack className='singlePostImg' justifyContent='center' backgroundColor='#eee'>
                    {imageUrl[imageIndex].type.includes('image') ?
                        <img onDoubleClick={likeButton} className='post-image' src={imageUrl[imageIndex].url} alt="Post"/>
                        :
                        <ReactPlayer width='100%' height='100%' controls={true} playing={true} loop={true} volume={1} muted={true} playIcon={<button>Play</button>} url={imageUrl[imageIndex].url}/>
                    }
                    {imageIndex != 0 &&
                        <i onClick={() => setImageIndex(imageIndex - 1)} className="bi bi-caret-left-fill nextPrevIcon" style={{left: '10px'}}></i>
                    }
                    {imageIndex != imageUrl.length - 1 &&
                        <i onClick={() => setImageIndex(imageIndex + 1)} className="bi bi-caret-right-fill nextPrevIcon" style={{right: '10px'}}></i>
                    }
                    {imageUrl.length > 1 &&
                        <Stack direction='row' alignItems='center' spacing={0.5}style={{position: 'absolute', bottom: '16px', left: '50%', transform: 'translate(-50%, 0%)'}}>
                            {imageUrl?.map((img, key) => {
                                return(
                                        <Box class="circle" style={{backgroundColor: key == imageIndex ? "#0089E5" : '#bbb'}}></Box>
                                    )
                                })}
                        </Stack>
                    }
                </Stack>

                {/* likes, aption and comment section */}
                <Box className='rightSideSinglePostBox'>
                    <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
                        <Stack direction='row' alignItems='center' spacing={1.5} p='12px 20px'>
                            <Avatar src='#'/>
                            <p className='pic_username'>{username}</p>
                        </Stack>
                        <Stack pr='10px' pt='2px'>
                            <i onClick={updateDisplay} class="bi bi-x" style={{fontSize: '35px', color: '#222'}}></i>
                        </Stack>
                    </Stack>
                    
                    <Box borderBottom='1px solid #ddd'></Box>

                    {/* all comments */}
                    <Box className='singlePostCommentBox'>
                        {/* caption */}
                        <Stack direction='row' alignItems='flex-start' p='6px 26px'>
                            <Avatar src='#' style={{width: '27px', height: '27px'}}/>
                            <p className='captionText commentSpacing'><span className='username'>{username} </span>{caption}</p>
                        </Stack>

                        {/* comments */}
                        {commentList?.map((element) => {
                        return(
                            <Stack direction='row' alignItems='flex-start' p='6px 26px'>
                                <Avatar src='#' style={{width: '27px', height: '27px'}}/>
                                <p className='captionText commentSpacing'><span className='username'>{element.username} </span>{element.comment}</p>
                            </Stack>
                        )
                        })}
                    </Box>

                    {/* like, comment, share button */}
                        <Stack direction='row' justifyContent='space-between' alignItems='center' mt='10px' px='20px'>
                            {/* like, share, comment */}
                            <Stack direction='row' alignItems='center' spacing={2}>
                                <p onClick={likeButton} className={isLike? 'icon-liked bi bi-heart-fill singlePostLikeBtn' : 'icons bi bi-heart singlePostLikeBtn'} id='likeBtn'></p>
                                <p className='icons bi bi-chat-right-text singlePostLikeBtn'></p>
                                {/* <p className='icons bi bi-send'></p> */}
                            </Stack>
                            {/* save */}
                            <Stack direction='row' alignItems='center'>
                                <p className='save-icon bi bi-bookmark singlePostLikeBtn'></p>
                            </Stack> 
                        </Stack>

                        {/* likes count  */}
                        <p className='likesCount1 singlePostLikeBtn'>{likes} likes</p>
                        
                        {/* post time */}
                        <p className='fontType postTime singlePostLikeBtn'>31 minutes ago</p>

                    {/* <Box mt='15px' borderBottom='1px solid #ddd'></Box> */}
                    
                    {/* input box */}

                    {/* <div className='emojiBox'>
                        {emojis.map(element => {
                            return(
                                <p>{element}</p>
                            )
                        })}
                    </div> */}

                    <Stack width='100%' direction='row' alignItems='center' spacing={0} pr='20px' style={{position: 'absolute', bottom: '0px', borderTop: '1px solid #ccc'}}>
                        <input onChange={handelComment} className='inputCommentBox' type='text' placeholder='Add a comment' value={comment}/>
                        <i onClick={postComment} class="postBtn2" style={{visibility: comment?.length==0 ? 'hidden': 'visible'}}>Post</i>
                    </Stack>
                </Box>
            </div>
        </Box>

        <Snackbar open={alertStatus} autoHideDuration={5000} onClose={handelAlert} sx={{position: 'fixed', bottom: '0px', right: '0px'}}>
            <Alert className='alertText' onClose={handelAlert} variant="filled" severity="success" sx={{ width: '100%'}}>
                Comment added successfully
            </Alert>
        </Snackbar>
    </>
  )
}

export default SinglePost