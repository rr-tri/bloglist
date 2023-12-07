import React, { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'


import { useNotification } from './contexts/NotificationContext' // Import the context
import { useUser } from './contexts/UserContext'
import blogService from './services/blogs'
import userService from './services/users'


import Blogs from './components/Blogs'
import Menu from './components/Menu'
import Notification from './components/Notification'

import Blog from './components/Blog'
import User from './components/User'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import Register from './components/Register'




const App = () => {

  const { showNotification } = useNotification()
  const { state, dispatch } = useUser()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      dispatch({ type: 'LOGIN', user })
      blogService.setToken(user.token)
      userService.setToken(user.token)

    }
  }, [])


  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('loggedInUser')
    showNotification('You logged out Successfully', 'info', 5000)
  }

  return (

    <Router>
      <Menu user={state.user} handleLogout={handleLogout} />
      <Box style={{ marginTop: 90 }}>
        <Notification />
        <Suspense fallback={<div>Loading...</div>}>

          <Routes>
            <Route path="/" element={<Blogs />} />
            <Route path="/blogs/:blogId" element={
              <Blog user={state.user} />
            } />
            <Route path="/users/:userId" element={
              <User />
            } />
            <Route path="/users" element={
              <Users />
            }
            />
            <Route path="/register" element={
              <Register />
            } />
            <Route
              path="/login"
              element={
                <LoginForm />
              } />
          </Routes>
        </Suspense>
      </Box>
    </Router >
  )
}

export default App
