import Alert from '@mui/material/Alert'
import { useNotification } from '../contexts/NotificationContext'
import React from 'react'
const Notification = () => {
  const { notification } = useNotification()

  return (
    <>
      {notification.visible && (
        <Alert data-testid="alert" severity={notification.type}>
          {notification.message}
        </Alert>
      )}
    </>
  )
}

export default Notification
