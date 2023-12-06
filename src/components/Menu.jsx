
import MLink from '@mui/material/Link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import LogoutIcon from '@mui/icons-material/ExitToApp'
import BookSharp from '@mui/icons-material/BookSharp'

import { Link, useNavigate } from 'react-router-dom'
import React from 'react'

const Menu = ({ user, handleLogout }) => {
  const navigate = useNavigate()
  const logout = () => {
    handleLogout()
  }
  return (
    <AppBar>
      <Toolbar>
        <MLink component={Link} to="/" color="inherit">
          <BookSharp fontSize="large" />{' '}
        </MLink>

        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <MLink
            component={Link}
            to="/"
            color="inherit"
            sx={{ marginRight: 2 }}
            underline="none"
            variant="h5"
            data-testid="nav-blogs"
          >
            blogs
          </MLink>
          <MLink
            component={Link}
            to={user ? '/users' : '/login'}
            color="inherit"
            underline="none"
            variant="h5"
          >
            users
          </MLink>
        </Box>

        {user
          ? (
            <Typography data-testid="login-username" variant="p">
              {user.username}{' '}
              <Tooltip title="Log out" disableFocusListener placement="top-start">
                <IconButton
                  type="submit"
                  value="Logout"
                  variant="contained"
                  onClick={logout}
                  data-testid="logoutButton"
                  aria-label="Logout Button"
                  sx={{ marginLeft: 1 }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Typography>
          )
          : (
            <Button
              variant="contained"
              type="submit"
              data-testid="login-button"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
      </Toolbar>
    </AppBar>
  )
}
export default Menu
