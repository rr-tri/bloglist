import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'

import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

import { useParams, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'


import blogService from '../services/blogs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '../contexts/NotificationContext' // Import the context

const Blog = ({ user }) => {
  const [content, setContent] = useState(' ')
  const navigate = useNavigate()
  const queryClient = useQueryClient() // access the query client
  const { showNotification } = useNotification()

  const blogId = useParams().blogId

  const getblog = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data.find((a) => a.id === blogId)
    }
  })
  const blog = getblog.data

  const updateMutation = useMutation({
    mutationFn: blogService.updateBlog,
    onError: (error) => {
      showNotification(error.response.data.error, 'error', 5000)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })


  const deleteMutation = useMutation({
    mutationFn: blogService.remove,
    onError: (error) => {
      // An error happened!
      showNotification(error.response.data.error, 'warning', 5000)
    },
    onSuccess: () => {
      // eslint-disable-next-line no-console
      // console.log('data.status===204', data)
      showNotification(`${blog.title} Deleted Successfully!`, 'warning', 5000)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/')

    }
  })

  const commentMutation = useMutation({
    mutationFn: blogService.createComment,
    onError: (error) => {
      showNotification(error.response.data.error, 'error', 5000)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setContent('')

    },
  })

  const handleDelete = () => {
    const confirmed = window.confirm(`Remove blog ${blog.title} ?`)
    if (confirmed) {
      deleteMutation.mutate(blog.id)
    }
  }
  const handleUpdateLikes = () => {
    if (user) {
      updateMutation.mutate({ ...blog, likes: blog.likes + 1 })
    } else {
      navigate('/login')
    }
  }
  const submitComment = () => {
    commentMutation.mutate({ blogId: blog.id, content })
  }
  if (getblog.isLoading) {
    return (
      <Container
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {' '}
        <CircularProgress color="success" />
      </Container>
    )
  }
  if (getblog.isError) {
    return <div>Error: Connect to the Internet</div>
  }
  return (
    <>
      <Container>
        <Typography variant="h5">
          {' '}
          {blog.title} {'   '}
        </Typography>
        by <Typography variant="caption">{blog.author} </Typography>
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
          for more info : <Link href={blog.url}>{blog.url}</Link>
          <span data-testid="likes" className="likes">
            {blog.likes} likes{' '}
            <IconButton
              color="info"
              variant="contained"
              data-testid="like-button"
              type="button"
              onClick={handleUpdateLikes}
            >
              <Tooltip
                title="Like Blog"
                disableFocusListener
                placement="top-start"
              >
                <ThumbUpIcon />
              </Tooltip>
            </IconButton>{' '}
          </span>
          <span></span>
          {user && user.username === blog.user.username && (
            <span>
              added by {blog.user.name}
              {'  '}
              <Tooltip
                title="Delete Blog"
                disableFocusListener
                placement="top-start"
              >
                <IconButton
                  variant="contained"
                  size="small"
                  data-testid="deleteButton"
                  color="error"
                  type="button"
                  onClick={handleDelete}
                >
                  {' '}
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </span>
          )}
        </Box>
        <Box>

        </Box>
        <Box
          style={{
            marginTop: 13,
            display: 'flex',
            flexGrow: 'start',
            flexDirection: 'row',
            justifyContent: 'start'
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            type="text"
            value={content}
            onChange={({ target }) => setContent(target.value)}
            style={{ marginRight: 5 }}
          />
          <Button variant="contained" onClick={submitComment}>
            Add Comment
          </Button>
        </Box>
        <ul>
          {blog.comments.map((c, id) => (
            <li key={id}>{c.content}</li>
          ))}
        </ul>
      </Container>
    </>
  )
}

export default Blog
