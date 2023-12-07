import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { useMutation } from '@tanstack/react-query'

import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

import { useNotification } from '../contexts/NotificationContext' // Import the context
import userService from '../services/users'

const Register = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const registerMutation = useMutation({
    mutationFn: userService.createUser,
    onError: (error) => {
      showNotification(error.response.data.error, 'error', 5000)
    },
    onSuccess: () => {
      showNotification(
        'User ' + name + ' register successful!!',
        'success',
        5000
      )
      navigate('/login')
    },
  })
  const signup = async (e) => {
    e.preventDefault()
    if (password !== passwordRepeat) {
      showNotification('Both password doesn\'t match!!', 'error', 5000)
      return
    }
    registerMutation.mutate({ name, password, username })
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        m: 'auto',
        width: '60vw',

        alignContent: 'space-between',
        justifyContent: 'space-between',
        textAlign: 'center'
      }}
      component="form"
      onSubmit={signup}
      noValidate
      autoComplete="off"
    >
      <h2>Register as New User</h2>
      <TextField
        sx={{ marginTop: 1 }}
        label="Full Name"
        type="text"
        value={name}
        name="Full name"
        onChange={({ target }) => setName(target.value)}
      />
      <TextField
        sx={{ marginTop: 1 }}
        label="Username"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <TextField
        sx={{ marginTop: 1 }}
        label="Password"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
      <TextField
        sx={{ marginTop: 1 }}
        label="Password"
        type="password"
        value={passwordRepeat}
        name="PasswordRepeat"
        onChange={({ target }) => setPasswordRepeat(target.value)}
      />
      <Button
        sx={{ marginTop: 1 }}
        color="success"
        variant="contained"
        type="submit"
      >
        Signup
      </Button>
    </Box>
  )
}

export default Register
