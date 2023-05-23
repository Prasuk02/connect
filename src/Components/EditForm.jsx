import React, {useContext, useState } from 'react'
import {Box, Stack, Button, Backdrop, Avatar} from '@mui/material'
import { db, storage } from '../firebase'
import '../stylesheets/editForm.css'
import { userDataContext } from '../App'
import loaderIcon from '../Images/loaderIcon.gif'

const EditForm = ({setEditFormStatus, userProfileData, alertDisplay, setAlertDisplay}) => {
  const {loader, setLoader} = useContext(userDataContext)
  const {fullname, biodata, biolink} = userProfileData
  // console.log(fullname)
  const [editDetails, setEditDetails] = useState({
    fullname: fullname,
    biodata: biodata,
    biolink: biolink
  })
  const [profileImgUrl, setProfileImgUrl] = useState()

  const closeForm = () => {
    setEditFormStatus('none')
  }

  const handleEditInput = (event) => {
    const data = {
      [event.target.name]: event.target.value
    }
    //spread operator to merge two objects
    setEditDetails({...editDetails, ...data})
  }

  const handleFile = (event) => {
    if(event.target.files[0])
    {
        setProfileImgUrl(event.target.files[0])
    }
  }

  const updateProfileDb = () => {
    setLoader(true)
    let bio = editDetails?.biodata?.split('\n')

    {profileImgUrl?
      // if
      storage.ref(`profilePics/${profileImgUrl?.name}`).put(profileImgUrl).then((snapshot) => {
        storage.ref('profilePics')
        .child(profileImgUrl.name)
        .getDownloadURL()
        .then((url) => {
          db.collection('usersData').doc(userProfileData.username).update({
            fullname: editDetails?.fullname,
            biodata: bio,
            biolink: editDetails?.biolink,
            profilePic: url
          })
          .then(() => {
            setEditFormStatus('none')
            setAlertDisplay({
              status: 'success',
              msg: 'Profile updated successfully',
              open: true
            })
          })
          .catch((error) => setAlertDisplay({
            status: 'error',
            msg: error,
            open: true
          }))
        })
      })
      // else
      : db.collection('usersData').doc(userProfileData.username).update({
        fullname: editDetails?.fullname,
        biodata: bio,
        biolink: editDetails?.biolink,
      })
      .then(() => {
        setEditFormStatus('none')
        setAlertDisplay({
          status: 'success',
          msg: 'Profile updated successfully',
          open: true
        })
      })
      .catch((error) => setAlertDisplay({
        status: 'error',
        msg: error,
        open: true
      }))
    }
    setLoader(false)
  }
  console.log(editDetails)
  console.log(profileImgUrl)

  return (
    <Box width='55%' height='75vh' style={{backgroundColor: 'transparent', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'hidden'}}>
        <Stack direction='row' height='100%'>
            <Box width='60%' style={{backgroundColor: 'white', borderRadius: '8px 0px 0px 8px'}}>
              <Stack px='30px' width='100%' height='70px' alignItems='flex-start' justifyContent='center' style={{backgroundColor: '#f4f4f4'}} borderRadius='8px 8px 0px 0px'>
                <p className='fontType editText'>Edit Profile</p>
              </Stack>
              
              <Box px='30px'>
                  {/* fullname */}
                  <Stack>
                    <label for='name' className='labelEdit'>Fullname</label>
                    <input onChange={handleEditInput} name='fullname' id='name' className='labelInput' type='text' value={editDetails?.fullname}/>
                  </Stack>
                  {/* profile data */}
                  <Stack>
                    <label for='data' className='labelEdit'>Add bio data</label>
                    <textarea onChange={handleEditInput} name='biodata' id='data' className='labelInput labelInputTextarea' value={editDetails?.biodata}></textarea>
                  </Stack>
                  {/* bio links */}
                  <Stack>
                    <label for='link' className='labelEdit'>Add bio links</label>
                    <textarea onChange={handleEditInput} name='biolink' id='link' className='labelInput labelInputTextarea' value={editDetails?.biolink}></textarea>
                  </Stack>

                  <p className='labelEdit'>Add follow links</p>
                  <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    {/* facebook */}
                    <Stack width='49%' direction='row' alignItems='flex-start'>
                      <label for='fbLink'><i class="bi bi-facebook" style={{padding: '0px 8px 7px', color: '#4867AA', border: '1px solid #ddd', borderRight: 'none', fontSize:'20px', backgroundColor: '#4867aa10'}}></i></label>
                      <input onChange={handleEditInput} name='fbLink' id='fbLink' className='labelInput' type='text' style={{width:'100%'}}/>
                    </Stack>
                    {/* twitter */}
                    <Stack width='49%' direction='row' alignItems='flex-start'>
                      <label for='twitterLink'><i class="bi bi-twitter" style={{padding: '0px 8px 7px', color: '#1da1f2', border: '1px solid #ddd', borderRight: 'none', fontSize:'20px', backgroundColor: '#4867aa10'}}></i></label>
                      <input onChange={handleEditInput} name='twitterLink' id='twitterLink' className='labelInput' type='text' style={{width:'100%'}}/>
                    </Stack>
                  </Stack>
              </Box>

              {/* edit btn */}
              <Stack px='30px' mt='16px' alignItems='flex-end'>
                <p onClick={updateProfileDb} className='fontType uploadBtn'>Save Changes</p>
              </Stack>
            </Box>


            <Box width='40%' style={{backgroundColor: '#FaFaFa', borderRadius: '0px 8px 8px 0px'}}>
              {/* close Btn */}
              <Stack pr='7px' alignItems='flex-end'>
                <i onClick={closeForm} class="bi bi-x" style={{fontSize:"30px", color: '#555'}}></i>
              </Stack>
              {/* fullname & username */}
              <Box m='auto' pt='0px' width='max-content'>
                <p className='fontType formFullname'>{userProfileData?.fullname}</p>
                <p className='fontType formUsername'>{userProfileData?.username}</p>

                {/* current and updated profile pic */}
                <Avatar src={userProfileData?.profilePic} alt={userProfileData?.fullname} style={{width: '120px', height: '120px', marginTop: '25px'}}/>
              </Box>

              {/* upload pic btn */}
              <Box width='max-content' m='20px auto 0px'>
                <label for='profilepic' className='fontType uploadBtn'>Upload profile pic</label>
                <input name='profilePic' onChange={handleFile} id='profilepic' type='file' style={{display: 'none'}}/>
              </Box>

              <Box width='90%' m='auto' mt='35px' backgroundColor='#f1f4fd' p='10px' border='1px solid #ccc' borderRadius='5px'>
                  <p className='fontType msg'>Upload new profile pic. Large image will be resized automatically</p>
                  <p className='fontType msg'>Try uploading image with format .png/.jpg/.jpeg</p>
              </Box>

              {/* account created date */}
              <p className='fontType msg2'>Account created <span style={{fontWeight: '600'}}>29 November 2019</span></p>
            </Box>

        </Stack>


        {loader && 
          <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <img src={loaderIcon} width='120px'/>
          </Backdrop>
        }
    </Box>
  )
}

export default EditForm