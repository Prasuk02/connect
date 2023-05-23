import React, { useState, useEffect, useContext } from 'react'
import { Box, Alert, Stack, Backdrop, Snackbar} from '@mui/material'
import {Avatar} from '@mui/material'
import {Link} from 'react-router-dom'
import {db} from '../firebase'
import { serverTimestamp } from 'firebase/firestore'
import SinglePost from './SinglePost'
import '../stylesheets/post_design.css'
import {arrayUnion} from 'firebase/firestore'
import firebase from 'firebase/compat/app';
import Modal_Alert from './Modal_Alert'
import { userDataContext } from '../App'
import ReactPlayer from 'react-player'
import {BsPause, BsFillPlayFill} from 'react-icons/bs'
import {FaVideo} from 'react-icons/fa'
import {GoUnmute, GoMute} from 'react-icons/go'

const Post = ({id, imageUrl, username, caption, likes, currentUsername, currentUserProfileData, postData}) => {
    // console.log(currentUserProfileData) 
    const {alertDisplay, setAlertDisplay} = useContext(userDataContext)
    const [postUsernameProfileData, setPostUsernameProfileData] = useState({})
    const [like, setlike] = useState(likes)
    const [isLike, setIsLike] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState([])
    const [display, setDisplay] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    const [playPauseDisplay, setPlayPauseDisplay] = useState("true")
    const [play, setPlay] = useState(false)
    const [mutePlayer, setMutePlayer] = useState(true)
    
    const handelComment = (event) => {
        setComment(event.target.value)
    }

    const seeComments = () => {
        setDisplay(true)
        setPlay(false)
        setMutePlayer(true)
    }

    const postComment = () => {
        db.collection('posts').doc(id).collection('comments').add({
            username: currentUsername,
            comment: comment,
            time: serverTimestamp()
        }).then(() => {
            setAlertDisplay({
                status: 'success',
                msg: 'Comment added successfully',
                open: true
            })
            setComment('')
        }
        )
    }

    useEffect(() => {
        const updateDb = () => {
            // console.log(`before: ${like}`)
            db.collection('posts').doc(id).update({
                likes: like
            })
        }
        updateDb()
    }, [like])

    const likeButton = () => {
        const updateLike = () => {
            if(isLike){
                setlike(like-1)
                db.collection('posts').doc(id).update({
                    accountsLiked: firebase.firestore.FieldValue.arrayRemove({
                        username: currentUserProfileData?.username,
                        fullname: currentUserProfileData?.fullname,
                        profilePic: currentUserProfileData?.profilePic 
                    })
                })

                db.collection('usersData').doc(username).update({
                    notification: arrayUnion({
                        username: currentUserProfileData?.username,
                        profilePic: currentUserProfileData?.profilePic,
                        post: imageUrl,
                        msg: 'has unliked your post',
                        time: firebase.firestore.Timestamp.now()
                    })
                })

                db.collection('usersData').doc(currentUsername).update({
                    postsLiked: firebase.firestore.FieldValue.arrayRemove({
                        postId: id
                    })
                })
            }
            else{
                setlike(like+1)
                //'update' agar field naah ho toh automatically bana deti hai
                db.collection('usersData').doc(username).update({
                    notification: arrayUnion({
                        username: currentUserProfileData?.username,
                        profilePic: currentUserProfileData?.profilePic,
                        post: imageUrl,
                        msg: 'has liked your post',
                        //server timestamp() not work with arrayUnion
                        time: firebase.firestore.Timestamp.now()
                    })
                })

                db.collection('posts').doc(id).update({
                    accountsLiked: arrayUnion({
                        username: currentUserProfileData?.username,
                        fullname: currentUserProfileData?.fullname,
                        profilePic: currentUserProfileData?.profilePic 
                    })
                })

                db.collection('usersData').doc(currentUsername).update({
                    postsLiked: arrayUnion({
                        postId: id
                    })
                })
            }
            setIsLike(!isLike)
            // setState properly value set jab hota hai jab function khatam ho jata hai
        }
        updateLike()
    }

    //in realtime snapshot useEffect is always used to prevent infinite loop
    useEffect(() => {
        db.collection('posts').doc(id).collection('comments').orderBy('time', 'desc').onSnapshot(snapshot => {
            setCommentList(snapshot.docs.map((doc) => {
                // console.log(id)
                return(
                    doc.data()
                )
            }))  
        })

        db.collection('usersData').doc(username).onSnapshot((doc) => {
            setPostUsernameProfileData(doc.data())
        })

        if(postData?.accountsLiked?.some(acc => acc.username == currentUsername)){
            setIsLike(true)
        }
        else{
            setIsLike(false)
        }

        if(currentUserProfileData?.postSaved?.some(post => post.postId == id)){
            setIsSaved(true)
        }
        else{
            setIsSaved(false)
        }
    }, [])

    const sendFollowRequest = () => {
        db.collection('usersData').doc(username).update({requests:  
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
        db.collection('usersData').doc(username).update({
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

    const savePost = () => {
        if(isSaved){
            db.collection('usersData').doc(currentUsername).update({
                postSaved: firebase.firestore.FieldValue.arrayRemove({
                    postId: id
                })
            })
        }
        else{
            db.collection('usersData').doc(currentUsername).update({
                postSaved: arrayUnion({
                    postId: id
                })
            })
        }
        setIsSaved(!isSaved)
    }

    const deletePost = () => {
        db.collection('posts').doc(id).delete()
        .then(setAlertDisplay({
            status: 'success',
            msg: 'Post deleted successfully',
            open: true
        }))
    }

    const unfollowAccount = () => {
        console.log('unfollowing')
        db.collection('usersData').doc(username).update({
           followers : firebase.firestore.FieldValue.arrayRemove({
                followerUsername: currentUserProfileData?.username,
                followerFullname: currentUserProfileData?.fullname,
                followerProfilePic: currentUserProfileData?.profilePic
            })
        })

        db.collection('usersData').doc(currentUsername).update({
            following: firebase.firestore.FieldValue.arrayRemove({
                followingUsername: postUsernameProfileData?.username,
                followingFullname: postUsernameProfileData?.fullname,
                followingProfilePic: postUsernameProfileData?.profilePic
            })
        }).then(setAlertDisplay({
            status: 'success',
            msg: `${username} unfollowed successfully`,
            open: true
        }))
    }

  return (
    <>
        <Modal_Alert alertDisplay={alertDisplay} setAlertDisplay={setAlertDisplay}/>
        <Box className='post'>
            <Stack>
                {/* heading -> avatar and username */}
                <Stack direction='row' alignItems='center' justifyContent='space-between' pb='10px' pt='5px' px='4px'>
                        <Stack direction='row' alignItems='center' spacing={1.2}>
                            <Link to={`/user/${username}`} style={{color: '#111', textDecoration: 'none'}}>
                                <Stack direction='row' alignItems='center' spacing={1.2}>
                                    <Avatar 
                                        src={postUsernameProfileData?.profilePic}
                                        alt={postUsernameProfileData?.fullname}
                                        // if image src not working avatar uses initial letter of alt
                                        sx={{width: '35px', height: '35px', backgroundColor: '#dcdcdc'}}/>
                                    <p className='postUsername'>{username}</p>
                                </Stack>
                            </Link>
                            {currentUsername !== username ?
                                currentUserProfileData?.following?.some(user => user.followingUsername == username) ? 
                                    <p className='postfollowingBtn fontType'>Following</p>
                                    :
                                    postUsernameProfileData?.requests?.some(user => user.reqUsername == currentUserProfileData?.username) ? 
                                    <p onClick={deleteFollowRequest} className='postreqBtn fontType'>Requested</p>
                                    :
                                    <p onClick={sendFollowRequest} className='postfollowBtn fontType'>Follow</p>
                                : ''
                            }
                        </Stack>

                    <Box className='optionMainBox' style={{position: 'relative'}}>
                        <i class="bi bi-three-dots-vertical" style={{color: '#222', padding: '10px 0px'}}></i>
                        <Box className='optionBox'>
                            {currentUsername == username &&
                                <Stack onClick={deletePost} borderBottom='1px solid #e6e6e6' py='11px' px='10px' direction='row' alignItems='center' justifyContent='space-between'>
                                    <p className='optionTextStyle'>Delete Post</p>
                                    <i class="bi bi-trash optionIconStyle" style={{color: '#dc3545'}}></i>
                                </Stack>
                            }
                            {currentUserProfileData?.following?.some(acc => acc.followingUsername==username) &&
                                <Stack onClick={unfollowAccount} borderBottom='1px solid #e6e6e6' py='11px' px='10px' direction='row' alignItems='center' justifyContent='space-between'>
                                    <p className='optionTextStyle'>Unfollow</p>
                                    <i class="bi bi-person-x-fill optionIconStyle"></i>
                                </Stack>
                            }
                        </Box>
                    </Box>
                </Stack>

                {/* post - image */}
                <Box position='relative'>
                    {imageUrl[imageIndex].type.includes('image') ?
                        <img onDoubleClick={likeButton} className='post-image' src={imageUrl[imageIndex].url} alt="Post"/>
                        :
                        <Box onMouseEnter={() => setPlayPauseDisplay('true')} onMouseLeave={() => setPlayPauseDisplay('false')}>
                            <ReactPlayer width='100%' height='100%' playing={play} loop={true} volume={0.5} muted={mutePlayer} playIcon={<button>Play</button>} url={imageUrl[imageIndex].url}/>
                            <FaVideo style={{color: 'white', position: 'absolute', top: '7px', right: '10px', width: '15px', height: '15px', opacity: '80%'}}/>
                            {playPauseDisplay == 'true' ?
                                play ? 
                                <BsPause onClick={() => setPlay(!play)} style={{color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70px', height: '70px', opacity: '90%'}}/>
                                :
                                <BsFillPlayFill onClick={() => setPlay(!play)} style={{color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70px', height: '70px', opacity: '90%'}}/>
                            :
                            ''
                            }
                            {playPauseDisplay == 'true' ?
                                mutePlayer ? 
                                <GoMute onClick={() => setMutePlayer(!mutePlayer)} style={{color: 'white', position: 'absolute', bottom: '13px', right: '10px', width: '15px', height: '15px', opacity: '90%'}}/>
                                :
                                <GoUnmute onClick={() => setMutePlayer(!mutePlayer)} style={{color: 'white', position: 'absolute', bottom: '13px', right: '10px', width: '15px', height: '15px', opacity: '90%'}}/>
                            :
                            ''
                            }
                        </Box>
                    }
                    {imageIndex != 0 &&
                        <i onClick={() => setImageIndex(imageIndex - 1)} className="bi bi-caret-left-fill nextPrevIcon" style={{left: '10px'}}></i>
                    }
                    {imageIndex != imageUrl.length - 1 &&
                        <i onClick={() => setImageIndex(imageIndex + 1)} className="bi bi-caret-right-fill nextPrevIcon" style={{right: '10px'}}></i>
                    }
                    {imageUrl.length > 1 &&
                        <Stack direction='row' alignItems='center' spacing={1}style={{position: 'absolute', bottom: '16px', left: '50%', transform: 'translate(-50%, 0%)'}}>
                        {imageUrl?.map((img, key) => {
                            return(
                                    <Box class="circle" style={{backgroundColor: key == imageIndex && "#0089E5"}}></Box>
                                )
                            })}
                        </Stack>
                    }
                </Box>

                {/* like, comment, share button */}
                <Stack direction='row' justifyContent='space-between' alignItems='center' mt='10px'>
                    {/* like, share, comment */}
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <p onClick={likeButton} className={isLike? 'icon-liked bi bi-heart-fill' : 'icons bi bi-heart'} id='likeBtn'></p>
                        <p onClick={seeComments} className='icons bi bi-chat-right-text'></p>
                        {/* <p className='icons bi bi-send'></p> */}
                    </Stack>
                    {/* save */}
                    <Stack direction='row' alignItems='center'>
                        <p onClick={savePost} className={isSaved ? 'save-icon bi bi-bookmark-fill' : 'save-icon bi bi-bookmark'}></p>
                    </Stack> 
                </Stack>

                {/* number of likes */}
                <p className='likesCount'>{likes} likes</p>

                {/* username & caption */}
                <p className='captionText'><span className='username'>{username}</span> {caption}</p>

                {/* Comments */}
                <p onClick={seeComments} className='commentText'>View all comments</p>
                {commentList?.slice(0, 2)?.map((element) => {
                    return(
                        <p className='captionText'><span className='username'>{element.username} </span>{element.comment}</p>
                    )
                })}
                <Stack direction='row' alignItems='center' spacing={2} borderBottom='1px solid #ccc' pr='8px' pb='6px'>
                    <input onChange={handelComment} className='commentInput' type='text' placeholder='Add a comment' value={comment}/>
                    <i onClick={postComment} class="bi bi-arrow-up-circle-fill postBtn" style={{visibility: comment?.length==0 ? 'hidden': 'visible'}}></i>
                </Stack>
            </Stack>
        </Box>

        {display == true &&
            <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <SinglePost
                    id={id}
                    imageUrl={imageUrl}
                    caption={caption}
                    username={username}
                    likes={likes}
                    currentUsername={currentUsername}
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
    </>
  )
}

export default Post
