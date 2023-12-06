import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

import React from 'react'


const BlogForm = ({ open, handleClose, createBlog }) => {
  const [newTitle, setNewTitle] = React.useState('')
  const [newAuthor, setNewAuthor] = React.useState('')
  const [newUrl, setNewUrl] = React.useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // Call createBlog with the form values
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    handleClose()
    // Clear the form fields
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }}>
        Create New Blog
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'space-around'
        }}
      >
        <TextField
          label="Title "
          type="text"
          value={newTitle}
          onChange={handleTitleChange}
          data-testid="title-input"
          sx={{ m: 2 }}
        />

        <TextField
          label="Author "
          type="text"
          value={newAuthor}
          onChange={handleAuthorChange}
          data-testid="author-input"
          sx={{ m: 2 }}
        />

        <TextField
          label="More Info(Url)"
          type="text"
          value={newUrl}
          onChange={handleUrlChange}
          data-testid="url-input"
          sx={{ m: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          type="submit"
          data-testid="create-button"
          startIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={handleSubmit}
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BlogForm
