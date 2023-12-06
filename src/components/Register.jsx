import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

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

  const signup = async (e) => {
    e.preventDefault()
    if (password !== passwordRepeat) {
      showNotification('Both password doesn\'t match!!', 'error', 5000)
      return
    }
    try {
      const user = await userService.createUser({ name, password, username })

      if (user.data) {
        showNotification(
          'User ' + name + ' register successful!!',
          'success',
          5000
        )
        navigate('/login')
      }
    } catch (e) {
      // console.log(e.response.data.error.split(',')[1].split('.')[1])
      showNotification(
        e.response.data.error.split(',')[1].split('.')[0],
        'error',
        5000
      )
    }
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
