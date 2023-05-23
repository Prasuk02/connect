import React, { useEffect, useState } from 'react'
import {Box, Stack, Alert} from '@mui/material'
import connect from '../Images/connect.png'
import Google_Play from '../Images/Google_Play.png'
import Microsoft from '../Images/Microsoft.png'
import {GrFacebook} from 'react-icons/gr'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import '../stylesheets/login.css' 
 
const Login = () => {
    const [loginCredentials, setLoginCredentials] = useState({})
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleInput = (event) => {
        let newSet = {
            [event.target.name]: event.target.value
        }
        setLoginCredentials({...loginCredentials, ...newSet})
    }

    const handleLogin = (key) => {
        if(key.code == 'Enter')
        {
            checkLoginDetails()
        }
    }

    const checkLoginDetails = () => {
        auth.signInWithEmailAndPassword(loginCredentials.loginId, loginCredentials.password)
        .then(() => {
            console.log('Login successful')
            navigate('/home')
        })
        .catch((error) => {
            // setError(`Error: ${error.code}`)
            setError(error.message)
            }
        )}

    useEffect(() => {
        if(error != ''){
            setTimeout(exitError, 4000)
        }

        function exitError(){
            setError('')
        }
    }, [error])    

    return(
        <>
            {error != '' &&
                <Alert variant="filled" severity="error" style={{width: '36%', position: 'absolute', top: '10px', left: '50%',transform: 'translate(-50%, 0%)', zIndex: '2'}}>
                    <p>{error}</p>
                </Alert>
            }
                
            <div className='background bgFilter'></div>
            <Box className='main'>
                <Box className='loginBox'>
                    <Stack>
                        {/* instagram font typography */}
                        <img className='instaTypo' src={connect} alt=""/>

                        {/* input boxes */}
                        <input onChange={handleInput} onKeyUp={handleLogin} className='inputBox' name='loginId' type='text' placeholder='Email address' required/>
                        <input onChange={handleInput} onKeyUp={handleLogin} className='inputBox' name='password' type='password' placeholder='Password' required/>

                        {/* login with credential button */}
                        <button onClick={checkLoginDetails} type='submit' className='loginButton'>Log In</button>

                        {/* divider */}
                        <div style={{position: 'relative'}}>
                            <p className='or'>OR</p>
                            <div className='divider' style={{position: 'absolute', top: '10px', left: '37px'}}></div>
                            <div className='divider' style={{position: 'absolute', top: '10px', right: '37px'}}></div>
                        </div>

                        {/* login with fb button */}
                        <Stack direction='row' spacing={0.9} m='auto' mt='30px'>
                            <p><GrFacebook style={{color: '#395498'}}/></p>
                            <p style={{color: '#395498', fontSize: '13px', fontWeight: '600'}}>Log in with facebook</p>
                        </Stack>

                        {/* forgot password buttom */}
                        <p className='forget'>Forgotten your password?</p>
                    </Stack>
                </Box>
                    
                {/* signup button box link to signup page*/}
                <Box className='box2'>
                    <Link to='/signup' style={{textDecoration: 'none', color: '#111'}}>
                        <p className='signup'>Don't have an account? <span style={{color: '#2c95fd', fontWeight: '600'}}>Sign up</span></p>
                    </Link>
                </Box>
                
                {/* external link badges */}
                <Stack direction='row' m='auto' mt='12px' width='70%' spacing={1} alignItems='center' justifyContent='space-evenly'>
                    <a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D4189921E-E337-48A0-A9B8-417F0886A19A%26utm_content%3Dlo%26utm_medium%3Dbadge">
                        <img className='googleplay' src={Google_Play} alt=""/>
                    </a>
                    <a href="ms-windows-store://pdp/?productid=9nblggh5l9xt&referrer=appbadge&source=www.instagram.com&mode=mini&pos=0%2C0%2C1366%2C728">
                        <img className='microsoft' src={Microsoft} alt=""/>
                    </a>
                </Stack>
            </Box>
        </>
    )
}

export default Login