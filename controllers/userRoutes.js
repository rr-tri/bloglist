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
        .json({ error: 'Both username and password must be at least 3 characters long.' })
    }
  } catch (e) {
    const errorPattern = /E11000 duplicate key error collection: .*{ username: "(.+)" }/
    const match = e.message.match(errorPattern)
    if (match && match.length > 1) {
      const username = match[1]
      logger.error(`Username "${username}" already exists.`)
      return response.status(400).json({ error: `Username "${username}" already exists.` })
    }

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
usersRouter.post('/delete/testuser', async (request, response) => {
  await User.findOneAndDelete({
    username: 'Tester'
  })

  response.status(204).end()
})
module.exports = usersRouter
