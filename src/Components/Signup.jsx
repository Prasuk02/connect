import React, { useContext } from 'react'
import {Box, Stack} from '@mui/material'
import connect from '../Images/connect.png'
import {GrFacebook} from 'react-icons/gr'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import {userDataContext} from '../App'
import '../stylesheets/login.css'

const Signup = () => {
    const {signupCredentials, setSignupCredentials} = useContext(userDataContext)
    // const setSignupCredentials = useContext(userDataContext)
    const navigate = useNavigate()

    const handleInput = (event) => {
        let newSet = {
            [event.target.name]: event.target.value
        }
        // using spread operator to add key in existing object
        setSignupCredentials({...signupCredentials, ...newSet})
        // console.log(signupCredentials)
    }

    const createNewUser = () => {
        auth.createUserWithEmailAndPassword(signupCredentials.loginId, signupCredentials.password)
        .then(() => {
            console.log("New User Created")
            navigate('/home')
        })
        .catch((error) => console.log(error))
    }

    return( 
        <>
            <div className='background bgFilter'></div>
            <Box className='main'>
                <Box className='loginBox'>
                    <Stack>
                        {/* instagram font typography */}
                        <img className='instaTypo' src={connect} alt=""/>

                        {/* login with fb credential button */}
                        <Stack direction='row' spacing={0.9} m='auto' style={{backgroundColor: '#395498', padding: '10px 66px', borderRadius: '5px'}}>
                            <p><GrFacebook style={{color: 'white'}}/></p>
                            <p style={{color: 'white', fontSize: '13px', fontWeight: '600'}}>Log in with facebook</p>
                        </Stack>

                        {/* divider */}
                        <div style={{position: 'relative', margin: '22px 0px 20px'}}>
                            <p className='or'>OR</p>
                            <div className='divider' style={{position: 'absolute', top: '10px', left: '37px'}}></div>
                            <div className='divider' style={{position: 'absolute', top: '10px', right: '37px'}}></div>
                        </div>

                        {/* input boxes */}
                        <input onChange={handleInput} name='loginId' className='inputBox' type='email' placeholder='Email address'/>
                        <input onChange={handleInput} name='fullname' className='inputBox' type='text' placeholder='Full name'/>
                        <input onChange={handleInput} name="username" className='inputBox' type='text' placeholder='Username'/>
                        <input onChange={handleInput} name='password' className='inputBox' type='password' placeholder='Password'/>

                        {/* signup with credential button */}
                        <button onClick={createNewUser} type='submit' className='loginButton'>Sign up</button>

                        {/* terms and conditions */}
                        <Box width='80.5%' m='auto' mb='18px'>
                            <p className='terms'>By signing up, you agree to our <span style={{color: '#004C98'}}>Terms, Privacy Policy</span > and <span style={{color: '#004C98'}}>Cookies Policy</span>.</p>
                        </Box>
                    </Stack>
                </Box>
                
                {/* link back to login page */}
                <Box className='box2'>
                    <Link to='/' style={{textDecoration: 'none', color: '#111'}}>
                        <p className='signup'>Already have an account? <span style={{color: '#2c95fd', fontWeight: '600'}}>Log in</span></p>
                    </Link>
                </Box>
            </Box>
        </>
    )
}

export default Signup