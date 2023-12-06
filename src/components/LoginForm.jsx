import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

const LoginForm = ({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) => {
  const navigate = useNavigate()
  const login = (event) => {
    event.preventDefault()
    handleLogin()
    navigate('/')
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
        onChange={handleUsernameChange}
      />

      <TextField
        sx={{ marginTop: 5, marginBottom: 5 }}
        label="Password"
        type="password"
        value={password}
        name="Password"
        onChange={handlePasswordChange}
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
