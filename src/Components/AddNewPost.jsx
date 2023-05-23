import React, {useState, useContext, useEffect} from 'react'
import { Box, Avatar, Stack, Backdrop} from '@mui/material'
import {BsImages} from 'react-icons/bs'
import {db, storage} from '../firebase'
import { arrayUnion, serverTimestamp } from 'firebase/firestore'
import '../stylesheets/AddNewPost.css'
import { userDataContext } from '../App'
import { postCategoriesContent } from '../content/sidebarContent'
import ReactPlayer from 'react-player'

function AddNewPost({username}){
    const {currentUserProfileData, alertDisplay, setAlertDisplay, setCreatePostDisplay} = useContext(userDataContext)
    const [imageUrl, setImageUrl] = useState([])
    const [caption, setCaption] = useState('')
    const [preview, setPreview] = useState([])
    const [prevKey, setPrevKey] = useState(0)
    const [docId, setDocId] = useState('')
    const [postCategories, setPostCategories] = useState([])

    const handleCaption = (event) => {
        setCaption(event.target.value)
    }

    const handleFile = (event) => {
        if(event.target.files[0])
        {
            const newImg = event.target.files[0]
            setImageUrl([...imageUrl, newImg])
            let previewUrl = {}
            if(newImg.type.includes('image')){
                previewUrl = {
                    url: URL.createObjectURL(event.target.files[0]),
                    type: 'image'
                }
            }
            else{
                previewUrl = {
                    url: URL.createObjectURL(event.target.files[0]),
                    type: 'video'
                }
            }
            setPreview([...preview, previewUrl])
        }
    }
    console.log(imageUrl)
    console.log(preview)

    const closeCreate = () => {
        console.log('closing create')
        setCreatePostDisplay({
            open: 'false'
        })
    }

    const displayImg = (key) => {
        setPrevKey(key)
    }

    const deleteImg = (key) => {
        //removing element from array in useState
        setPreview(preview.filter(prev => prev != preview[key]))
        setImageUrl(imageUrl.filter((img) => img != imageUrl[key]))
    }

    const newPostToFirebase = async() => {
            if(imageUrl.length > 0){
                storage.ref(`images/${imageUrl[0].name}`).put(imageUrl[0]).then((snapshot) => {
                    console.log('Uploaded file in storage');
                    storage.ref('images')
                           .child(imageUrl[0].name)
                           .getDownloadURL() 
                           .then(async(url) => {
                                let docRef = await db.collection("posts").add({
                                    caption: caption,
                                    imageUrl: [{
                                        url: url,
                                        type: imageUrl[0].type
                                    }],
                                    username: username,
                                    likes: 0,
                                    category: postCategories,
                                    time: serverTimestamp()
                                })
                                setDocId(docRef.id)
                           })
                           .then(() => {
                            if(imageUrl.length == 1){
                                setCreatePostDisplay({
                                    open: 'false'
                                })
                                setAlertDisplay({
                                    status: 'success',
                                    msg: 'Post added successfully 👍',
                                    open: true
                                })
                            }
                           })
                            .catch((error) => {
                                setAlertDisplay({
                                    status: 'error',
                                    msg: error,
                                    open: true
                                })
                            });
                });
            }
            else{
                setAlertDisplay({
                    status: 'error',
                    msg: "Select atleast 1 image to share post",
                    open: true
                })
            }
    }
    
    useEffect(() => {
        if(docId != ''){
            console.log(docId)
            if(imageUrl.length > 1){
                for(let img=1; img < imageUrl.length; img++){
                    console.log("USE EFFECT CALLED USE EFFECT CALLED USE EFFECT CALLED USE EFFECT CALLED USE EFFECT CALLED ")
                    storage.ref(`images/${imageUrl[img].name}`).put(imageUrl[img]).then((snapshot) => {
                        console.log('Uploaded file in storage');  
                        storage.ref('images')
                        .child(imageUrl[img].name)
                        .getDownloadURL()
                        .then((url) => {
                            db.collection('posts').doc(docId).update({
                                imageUrl: arrayUnion({
                                    url: url,
                                    type: imageUrl[img].type
                                })
                            })
                        })
                        .then(() => {
                            if(img == imageUrl.length - 1){
                                setCreatePostDisplay({
                                    open: 'false'
                                })
                                setAlertDisplay({
                                    status: 'success',
                                    msg: 'Post added successfully 👍',
                                    open: true
                                })
                            }
                        })
                        .catch((error) => {
                            setAlertDisplay({
                                status: 'error',
                                msg: error,
                                open: true
                            })
                        });
                    })
                }
            }
        }
    }, [docId])

    const addPostCategory = (element) => {
        if(postCategories.includes(element)){
            setPostCategories(postCategories.filter(category => category != element))
        }
        else{
            setPostCategories([...postCategories, element])
        }
    }

    return(
        <>
            <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Box className="createPostMainBox">
                    <Stack px='20px' direction='row' alignItems='center' justifyContent='space-between'>
                        <i onClick={closeCreate} className='bi bi-arrow-left' style={{fontSize: '20px'}}></i>
                        <p style={{textAlign: 'center', fontWeight: '500', padding: '13px 0px', fontSize: '16px'}}>Create new post</p>
                        <p onClick={newPostToFirebase} style={{fontSize: '14px', color: '#007CCE', fontWeight: '500'}}>Share post</p>
                    </Stack>  
                    <Box style={{borderTop: '1px solid #ddd'}}></Box>
                    <Stack direction='row' height='100%'>
                        {preview.length != 0 ? 
                            <Box width='57%' backgroundColor= '#f5f5f5'>
                                <Stack height='280px' justifyContent='flex-end'>
                                    {preview[prevKey]?.type == 'image' ?
                                        <img id='enlargeImg' className='previewImage' src={preview[prevKey].url}/>
                                        :
                                        <ReactPlayer width='100%' height='100%' playing={true} loop={true} volume={1} muted={true} playIcon={<button>Play</button>} url={preview[prevKey].url}/>
                                    }
                                </Stack>
                                
                                <Box width='88%' m='auto' mt='13px' style={{borderTop: '1px solid #ddd'}}></Box>

                                <Stack width='100%' mt='13px' px='23px' direction='row' spacing={1.5} alignItems='center'>
                                    {preview.map((prev, key) => {
                                        return(
                                            <Stack height='85px' width='70px' border= '1px solid #aaaaaa' borderRadius='5px' justifyContent='center' position='relative'>
                                                {prev.type == 'image' ? 
                                                    <img onClick={() => displayImg(key)} src={prev.url} class="previewImage" style={{minHeight: '60px'}}/>
                                                    :
                                                    <ReactPlayer volume='0' onClick={() => displayImg(key)} width='100%' height='100%' url={prev.url}/>
                                                }
                                                <i onClick={() => deleteImg(key)} className='bi bi-x' style={{fontSize: '20px', position: 'absolute', top: '-5px', right: '0px'}}></i>
                                            </Stack>
                                        )
                                    })}
                                    {preview.length < 5 &&
                                        <Box pt='6px' height='85px'>
                                            <label htmlFor='newPost' class="bi bi-plus" style={{fontSize: '45px', color: '#aaa', border: '1px solid #aaaaaa', padding: '5px 10px 18px 10px', borderRadius: '5px'}}></label> 
                                            <input onChange={handleFile} accept="image/*, video/*" id='newPost' type='file' style={{display: 'none'}}/>
                                        </Box>
                                    }
                                </Stack>
                            </Box>
                            :
                            <Box width='57%' backgroundColor= '#f5f5f5'>
                                <Box width='max-content' m='auto'>
                                    <i class="bi bi-image" style={{fontSize: '190px', color: '#ddd'}}></i>
                                </Box>
                                <Stack m='auto' width='max-content' className='selectImage' direction='row' alignItems='center' spacing={1}>
                                    <BsImages style={{width: '20px', height: '20px'}}/>
                                    <label className='buttonText' htmlFor='newPost'>Select Image or Video</label>
                                    <input onChange={handleFile} accept="image/*, video/*" id='newPost' type='file' style={{display: 'none'}}/>
                                </Stack>
                            </Box>
                        }
                        <Box width='43%' pt='18px' borderLeft= '1px solid #eee'>
                            <Box pl='17px'>
                                <Stack direction='row' alignItems='center' spacing={1.75}>
                                    <Avatar style={{backgroundColor: '#E9E9E9', width: '32px', height: '32px'}}
                                        src={currentUserProfileData?.profilePic}
                                        alt={currentUserProfileData?.fullname}
                                    />
                                    <p className='buttonText'>{currentUserProfileData?.username}</p>
                                </Stack>
                                {/* <BsFillArrowRightCircleFill onClick={newPostToFirebase} style={{color: '#18c256', width: '32px', height: '33px'}}/> */}
                                <textarea onChange={handleCaption} className='inputpost' type='text' placeholder='Write a caption...' value={caption}></textarea>
                            </Box>
                            
                            <Box style={{borderTop: '1px solid #ddd'}}>
                                <Box p='13px'>
                                    <p style={{marginTop: '2px', fontSize: '13.5px', fontWeight: '600', color: '#222'}}>Select Post Category:</p>
                                    <Stack className='categoryList' height='100px' mt='3px' direction='row' alignItems="center" justifyContent='flex-start' flexWrap='wrap' overflow='auto'>
                                        {postCategoriesContent?.map((element) => {
                                            return(
                                                <span onClick={() => addPostCategory(element)} className='categoryList' style={{marginTop: '8px', marginRight: '10px', fontSize: '13px', fontWeight: '500', color: postCategories.includes(element) ? '#000' : '#333', backgroundColor: postCategories.includes(element) ? '#e5e5e5' : '#f1f1f1', borderRadius: '10px', border: '1px solid #efefef', padding: '3px 9px'}}>{element}</span>
                                            )
                                        })}
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Backdrop>
        </>
    )
}
export default AddNewPost