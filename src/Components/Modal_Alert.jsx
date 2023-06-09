import React from 'react'
import { Alert, Snackbar} from '@mui/material'

const Modal_Alert = ({alertDisplay, setAlertDisplay}) => {
  const handleAlert = () => {
    setAlertDisplay({
      status: alertDisplay.status,
      msg: alertDisplay.msg,
      open: false
    })
  }

  return (
    <Snackbar open={alertDisplay?.open} autoHideDuration={2000} onClose={handleAlert}>
      <Alert variant='filled' severity={alertDisplay?.status} onClose={handleAlert} sx={{ width: '100%', fontWeight: '500', fontSize: '14px'}}>
        {alertDisplay?.msg}
      </Alert>
    </Snackbar>
  )
}

export default Modal_Alert