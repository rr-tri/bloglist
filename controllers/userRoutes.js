const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/userSchema')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')

//* adding the user to database
usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body
    if (password.length > 3 && username.length > 3) {
      const saltRounds = 11
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        name,
        passwordHash,
      })

      const savedUser = await user.save()
      response.status(201).json(savedUser)
    } else {
      response
        .status(400)
        .json('Both username and password must be at least 3 characters long.')
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      return response.status(400).json({ error: e.message })
    }
    logger.error(e.message)
    return next(e.message)
  }
})
//* fetching users data
usersRouter.get('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  response.json(users)
})

module.exports = usersRouter
