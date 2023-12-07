/* eslint-disable linebreak-style */

import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import StyledLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import BlogForm from './BlogForm'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotification } from '../contexts/NotificationContext' // Import the context
import blogService from '../services/blogs'
import { useUser } from '../contexts/UserContext'

const Blogs = () => {
  const [createBlogVisibility, setCreateBlogVisibility] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { state } = useUser()

  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  const createBlogMutation = useMutation(
    {
      mutationFn: blogService.create,
      onError: (error) => {
        showNotification(error.message, 'error', 5000)
      },
      onSuccess: (context) => {

        showNotification(
          `Added Blog '${context.title}' successfully !`,
          'info',
          5000
        )

        queryClient.invalidateQueries({ queryKey: ['blogs'] })
      },
    })


  // if (createBlogMutation.isPending) {
  //   showNotification('adding bloglist')
  // }
  const getblogs = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => {
      if (Array.isArray(data)) {
        return data.sort((a, b) => b.likes - a.likes)
      }
      return data
    }
  })

  const handleCloseDialog = () => {
    setCreateBlogVisibility(false)
  }
  const createBlog = (obj) => {
    try {
      createBlogMutation.mutate(obj)

    } catch (exception) {
      showNotification(
        exception.response.data.error ||
        'Opss something went wrong while updating',
        'error',
        5000
      )
    }
  }


  const blogs = getblogs.data || []
  const itemsPerPage = 7
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = currentPage * itemsPerPage
  const paginatedBlogs = blogs.slice(startIndex, endIndex) || []

  return (
    <Box>
      <Box>
        <Tooltip title="Add Blog" disableFocusListener placement="top-start">
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              if (state.user) {
                setCreateBlogVisibility(true)
              } else {
                showNotification('Please login first to add blog', 'info', 5000)
              }
            }}
          >
            new blog
          </Button>
        </Tooltip>
      </Box>
      <BlogForm
        open={createBlogVisibility}
        handleClose={handleCloseDialog}
        createBlog={createBlog}
      />
      {getblogs.isLoading ? <CircularProgress color="success" /> : null}
      {(getblogs.isError) ? <div>Problem fetching data: please try again later</div> : null}
      <Box>
        {paginatedBlogs.map((blog) => (
          <Box data-testid="blog" key={blog.id} sx={{ p: 2 }}>
            <StyledLink
              component={Link}
              variant="h6"
              color="inherit"
              underline="none"
              to={`/blogs/${blog.id}`}
              data-testid="blog-title"
            >
              {blog.title}
              {'   '}
              <Typography variant="caption">
                {' '}
                by {blog.author}
              </Typography>{' '}
            </StyledLink>
          </Box>
        ))}
      </Box>

      <Box style={{ display: 'flex', justifyContent: 'center', margin: 20 }}>
        {blogs.length > itemsPerPage && (
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(blogs.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="success"
            />
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default Blogs
