import { useParams, Link, useNavigate } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import React from 'react'

import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import StyledLink from '@mui/material/Link'




const User = () => {
  const navigate = useNavigate()
  const userId = useParams().userId
  const loggedUserJSON = window.localStorage.getItem('loggedInUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    userService.setToken(user.token)

  } else {
    navigate('/login')
  }
  const getUser = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data.find((a) => a.id === userId)
    }
  })
  if (getUser.isLoading) {
    return (
      <Container
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress color="success" />
      </Container>
    )
  }
  const user = getUser.data

  return (
    <>
      <Typography variant="h5">{user.name}</Typography>
      <Typography variant="body">Total Blogs :{user.blogs.length}</Typography>
      <Typography variant="h6">Added Blog List</Typography>
      <ol>
        {user.blogs.map((blog) => (
          <li key={blog.id}>

            <StyledLink
              component={Link}
              variant="h6"
              color="inherit"
              underline="none"
              to={`/blogs/${blog.id}`}
              data-testid="addedBlog"
            >
              {blog.title}
            </StyledLink>{' '}
            <Typography variant="caption">by {blog.author}</Typography>
          </li>
        ))}
      </ol>
    </>
  )
}

export default User
