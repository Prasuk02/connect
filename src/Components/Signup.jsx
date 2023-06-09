import React, { useContext, useState, useEffect } from 'react'
import {Box, Stack, Alert} from '@mui/material'
import {signInWithPopup, FacebookAuthProvider, GoogleAuthProvider} from 'firebase/auth'
import connect from '../Images/connect.png'
import {GrFacebook} from 'react-icons/gr'
import {GrGoogle} from 'react-icons/gr'
import {VscEye, VscEyeClosed} from 'react-icons/vsc'
import { auth, db } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import {userDataContext} from '../App'
import '../stylesheets/login.css'

const Signup = () => {
    const {signupCredentials, setSignupCredentials} = useContext(userDataContext)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(true)
    const [allUserName, setAllUserName] = useState([])
    // const setSignupCredentials = useContext(userDataContext)
    const navigate = useNavigate()

    useEffect(() => {
        db.collection('usersData').onSnapshot(snapshot => {
            setAllUserName(snapshot?.docs?.map(doc => {
                return(
                    doc.id
                )
            }))
        })
    }, [])

    // console.log(allUserName)

    const handleInput = (event) => {
        let newSet = {
            [event.target.name]: event.target.value
        }
        // using spread operator to add key in existing object
        setSignupCredentials({...signupCredentials, ...newSet})
        // console.log(signupCredentials)
    }

    const signUp = (key) => {
        if(key.code == 'Enter'){
            createNewUser()
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

    const createNewUser = () => {
        if(allUserName?.includes(signupCredentials?.username)){
            return(
                setError("Username already taken ❕")
            )
        }
        auth.createUserWithEmailAndPassword(signupCredentials.loginId, signupCredentials.password)
        .then(() => {
            console.log("New User Created")
            navigate('/home')
        })
        .catch((error) => {
            if(error.message ='Firebase: This operation is restricted to administrators only. (auth/admin-restricted-operation).'){
                setError("Kindly fill up the credentials or email id already exist")
                return
            }
            setError(error.message)
        })
    }

    useEffect(() => {
        if(error != ''){
            setTimeout(() => {
                setError('')
            }, 5000)
        }
    }, [error])

    return( 
        <>
            {error != '' &&
                <Alert className='errorAlert' variant="filled" severity="error">
                    <p className='error'>{error}</p>
                </Alert>
            }
            <div className='background'></div>
            <Box className='main'>
                <Box className='loginBox'>
                    <Stack>
                        {/* connect logo */}
                        <img className='instaTypo' src={connect} alt=""/>

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

                        {/* divider */}
                        <div style={{position: 'relative', margin: '22px 0px 20px'}}>
                            <p className='or'>OR</p>
                            <div className='divider' style={{position: 'absolute', top: '10px', left: '37px'}}></div>
                            <div className='divider' style={{position: 'absolute', top: '10px', right: '37px'}}></div>
                        </div>

                        {/* input boxes */}
                        <input onKeyUp={signUp} onChange={handleInput} name='loginId' className='inputBox' type='email' placeholder='Email address' required/>
                        <input onKeyUp={signUp} onChange={handleInput} name='fullname' className='inputBox' type='text' placeholder='Full name' required/>
                        <input onKeyUp={signUp} onChange={handleInput} name="username" className='inputBox' type='text' placeholder='Username' required/>
                        <Stack className='inputPasswordBox' direction='row' spacing={1.5} justifyContent='space-between'alignItems='center'>
                            <input onKeyUp={signUp} onChange={handleInput} name='password' className='inputBoxPassword' type='password' placeholder='Password' required/>
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

                        {/* signup with credential button */}
                        <input onClick={createNewUser} type='submit' className='loginButton' value='SIGN UP' />

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