const router = require('express').Router()
const Blog = require('../models/blogSchema')
const logger = require('../utils/logger')
const Comment = require('../models/commentSchema')
const jwt = require('jsonwebtoken')

//* route to get all the blogs on database
router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('comments')
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
//* route to get single blog with blog id
router.get('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})
//* route for adding the new blog to database
router.post('/', async (request, response, next) => {
  try {
    const { title, url, author } = request.body
    if (!title || !url) {
      return response.status(400).json({ error: 'Title and URL are required' })
    }
    // logger.info("token111 = ", request.token);
    //* Check for valid  token
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // logger.info("token = ",decodedToken);
    // logger.info("token id = " ,decodedToken.id);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user
    // logger.info("user data = ", request.user)
    const blog = new Blog({
      title: title,
      url: url,
      author: author,
      user: user.id,
    })
    const result = await blog.save()
    // console.log(result);
    // update blog id list in user details
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})
//* route for adding the new comment to database
router.post('/:id/comments', async (request, response, next) => {
  try {
    const { content } = request.body
    if (!content) {
      return response.status(400).json({ error: 'Content is required' })
    }

    //* Check for valid  token
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)

    // logger.info("user data = ", request.user)
    const comment = new Comment({
      content: content,
      blog: request.params.id,
    })
    const result = await comment.save()
    // console.log(result);
    // update blog id list in user details
    blog.comments = blog.comments.concat(result._id)
    await blog.save()

    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})
//* route to blog details using blog id
router.put('/:blogId', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.userId,
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.blogId,
      blog,
      {
        new: true,
      }
    )
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})
//* route to likes using blog id
router.put('/ul/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: request.params.id },
      { $set: { likes: request.body.likes } },
      { new: true }
    )
    // logger.info(updatedBlog);
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.json(updatedBlog)
  } catch (error) {
    logger.info(error)
    next(error)
  }
})
//* route to delete blog using blog id
router.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    // logger.info('blog = ', blog)
    // logger.info("user = ",user)
    if (user._id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
      logger.info('deleted successfully')
    } else {
      response.status(400).json({ error: 'deletion not permitted' }).end()
      logger.info('deletion is not permitted')
    }
  } catch (error) {
    logger.info(error)
    next(error)
  }
})
router.post('/delete/testblog', async (request, response) => {
  await Blog.findOneAndDelete({
    title: 'New Test Blog Title'
  })
  response.status(204).end()
})
module.exports = router
