import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
// Create a context for the notification
const NotificationContext = createContext()

// Actions
const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION'

// Reducer function to manage the notification state
const notificationReducer = (state, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        message: action.payload.message,
        type: action.payload.type,
        visible: true
      }
    case HIDE_NOTIFICATION:
      return {
        ...state,
        visible: false
      }
    default:
      return state
  }
}

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    message: '',
    type: '', //  'success', 'info', 'warning', or 'error'
    visible: false
  })

  const showNotification = (message, type = 'info', duration = 5000) => {
    dispatch({ type: SHOW_NOTIFICATION, payload: { message, type } })

    // Automatically hide the notification after a few seconds (e.g., 5 seconds)
    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION })
    }, duration) // Adjust the time as needed
  }

  const hideNotification = () => {
    dispatch({ type: HIDE_NOTIFICATION })
  }

  return (
    <NotificationContext.Provider
      value={{
        notification: state,
        showNotification,
        hideNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
}
// Custom hook for accessing the notification context
export const useNotification = () => {
  return useContext(NotificationContext)
}
