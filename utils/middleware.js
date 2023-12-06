const logger = require('./logger')
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Req Body:  ', request.body)
  logger.info('---')
  next()
}
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}
const userExtractor = async (request, res, next) => {
  const token = request.token
  // logger.info('token middleware user = ', token)
  if (!token) {
    // If there's no token, no user to extract
    return next()
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    // Find the user in the database by the user ID from the token
    const user = await User.findById(decodedToken.id)
    // Attach the user to the request object for use in route handlers
    request.user = user
  } catch (error) {
    // Handle token verification errors
    // logger.error(error.message)
    return res.status(401).json({ error: 'Invalid token' })
  }

  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
