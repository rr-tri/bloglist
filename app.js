
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const path = require('path')


const middleware = require('./utils/middleware')
const blogRoutes = require('./controllers/blogRoutes')
const userRoutes = require('./controllers/userRoutes.js')
const logger = require('./utils/logger')
const loginRouter = require('./controllers/loginRoutes.js')
const config = require('./utils/config.js')


const app = express()

mongoose.set('strictQuery', false)
// logger.info('Starting to establish connection to MongoDB')
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB successfully')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/blogs', blogRoutes)
app.use('/api/users', userRoutes)
app.use('/api/login', loginRouter)

app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
})
app.get('/healthcheck', (req, res) => {
  res.status(200).send('ok')
})
// // Serve the built React files from the frontend's build folder
// app.use(express.static('dist'))

if (config.NODE_ENV === 'test ') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}


const DIST_PATH = path.resolve(__dirname, './dist')
const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')
app.use(express.static(DIST_PATH))
app.get('*', (req, res) => res.sendFile(INDEX_PATH))

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
// Start the server on port 3001 (or any desired port)
const PORT = config.PORT || 3001
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})
