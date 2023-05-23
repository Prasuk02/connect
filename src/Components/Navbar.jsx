import React, { useContext } from 'react'
import {Stack, Backdrop} from '@mui/material'
import connectHeader2 from '../Images/connectHeader2.png'
import loaderIcon from '../Images/loaderIcon.gif'
import { userDataContext } from '../App'

const Navbar = () => {
  return (
    <>
        <Stack justifyContent='center' width='100%' height='60px' borderBottom='1px solid #eee' style={{backgroundColor: 'white', position: 'sticky', top: '0px', zIndex: '2'}}>
            <Stack direction='row' alignItems='center' justifyContent='space-evenly'>
                <img src={connectHeader2} alt="" width='125px'/>
            </Stack>
        </Stack>


        {/* {loader && 
          <Backdrop open='true' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <img src={loaderIcon} width='120px'/>
          </Backdrop>
        } */}
    </>
  )
}

export default Navbar
