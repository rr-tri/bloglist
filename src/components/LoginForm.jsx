import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import loginService from '../services/login'
import userService from '../services/users'
import blogService from '../services/blogs'

import { useNotification } from '../contexts/NotificationContext'
import { useUser } from '../contexts/UserContext'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const { showNotification } = useNotification()
  const { dispatch } = useUser()
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onError: (error) => {
      showNotification(error.response.data.error, 'error', 5000)
    },
    onSuccess: (data) => {
      dispatch({ type: 'LOGIN', user: data })
      window.localStorage.setItem('loggedInUser', JSON.stringify(data))
      blogService.setToken(data.token)
      userService.setToken(data.token)
      setUsername('')
      setPassword('')
      showNotification(`${data.username} logged in successfully`, 'success', 5000)
      navigate('/')

    },
  })

  const login = (event) => {
    event.preventDefault()
    loginMutation.mutate({
      username,
      password
    })
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        m: 'auto',
        width: '60vw',
        justifyContent: 'space-between',
        textAlign: 'center'
      }}
      component="form"
      onSubmit={login}
      noValidate
      autoComplete="off"
    >
      <h2>Log in to application</h2>
      <TextField
        sx={{ marginTop: 5 }}
        label="User Name"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />

      <TextField
        sx={{ marginTop: 5, marginBottom: 5 }}
        label="Password"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />

      <Button color="success" variant="contained" type="submit">
        login
      </Button>
      <Box>
        new user ? {'  '}{' '}
        <Typography
          component={Link}
          to="/register"
          color="inherit"
          sx={{ marginRight: 2 }}
        >
          Signup
        </Typography>
      </Box>
    </Box>
  )
}

export default LoginForm
