import React, { useEffect, useState } from 'react'
import {Box, Stack, Alert} from '@mui/material'
import {signInWithPopup, FacebookAuthProvider, GoogleAuthProvider} from 'firebase/auth'
import connect from '../Images/connect.png'
import Google_Play from '../Images/Google_Play.png'
import Microsoft from '../Images/Microsoft.png'
import {GrFacebook, GrGoogle} from 'react-icons/gr'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import '../stylesheets/login.css' 
 
const Login = () => {
    const [loginCredentials, setLoginCredentials] = useState({})
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(true)
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

    const signInWithFacebook = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
        .then(() => {
            console.log('Login successful')
            navigate('/home')
        })
        .catch(() => {
            setError(error.message)
        })
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then(() => {
            console.log('Login successful')
            navigate('/home')
        })
        .catch(() => {
            setError(error.message)
        })
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
                <Alert className='errorAlert' variant="filled" severity="error">
                    <p className='error'>{error}</p>
                </Alert>
            }
            
            <Box>
                <div className='background bgFilter'></div>
                <Box className='main'>
                    <Box className='loginBox'>
                        <Stack>
                            {/* instagram font typography */}
                            <img className='instaTypo' src={connect} alt=""/>

                            {/* input boxes */}
                            <input onChange={handleInput} onKeyUp={handleLogin} className='inputBox' name='loginId' type='text' placeholder='Email address' required/>
                            {/* <input onChange={handleInput} onKeyUp={handleLogin} className='inputBox' name='password' type='password' placeholder='Password' required/> */}
                            <Stack className='inputPasswordBox' direction='row' spacing={1.5} justifyContent='space-between'alignItems='center'>
                                <input onKeyUp={handleLogin} onChange={handleInput} name='password' className='inputBoxPassword' type='password' placeholder='Password' required/>
                                {showPassword ?
                                    <span onClick={() => {
                                        setShowPassword(!showPassword)
                                        document.getElementsByClassName('inputBoxPassword')[0].type='text'
                                    }
                                    } style={{fontSize: '14px'}}>🙈</span>
                                    :
                                    <span onClick={() => {
                                        setShowPassword(!showPassword)
                                        document.getElementsByClassName('inputBoxPassword')[0].type='password'
                                    }
                                    } style={{fontSize: '14px'}}>🐵</span>
                                }
                                {/* {showPassword ?
                                    <VscEye onClick={() => {
                                        setShowPassword(!showPassword)
                                        document.getElementsByClassName('inputBoxPassword')[0].type='text'
                                    }
                                    }/>
                                    :
                                    <VscEyeClosed onClick={() => {
                                        setShowPassword(!showPassword)
                                        document.getElementsByClassName('inputBoxPassword')[0].type='password'
                                    }
                                    }/>
                                } */}
                            </Stack>


                            {/* login with credential button */}
                            <button onClick={checkLoginDetails} type='submit' className='loginButton'>LOGIN</button>

                            {/* divider */}
                            <div style={{position: 'relative', margin: '22px 0px 20px'}}>
                                <p className='or'>OR</p>
                                <div className='divider' style={{position: 'absolute', top: '10px', left: '37px'}}></div>
                                <div className='divider' style={{position: 'absolute', top: '10px', right: '37px'}}></div>
                            </div>

                            {/* login with fb and google credential button */}
                            <Stack direction='row' alignItem='center' m='auto' spacing={1}>
                                <Stack onClick={signInWithFacebook} className='FGBox fb' direction='row' spacing={0.9}>
                                    <p className='FGicon'><GrFacebook/></p>
                                    <p className='FGtext'>Facebook</p>
                                </Stack>
                                <Stack onClick={signInWithGoogle} className='FGBox google' direction='row' spacing={0.9}>
                                    <p className='FGicon'><GrGoogle/></p>
                                    <p className='FGtext'>Google</p>
                                </Stack>
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
            </Box>
        </>
    )
}

export default Login