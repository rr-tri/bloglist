const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    validate: {
      validator: (value) => /^[a-zA-Z0-9]+$/.test(value), // Username contains only alphanumeric characters
      message: 'Username can only contain letters and numbers',
    },
  },
  name: {
    type: String,
    minlength: 3,
    validate: {
      validator: (value) => /^[a-zA-Z\s]+$/.test(value), // Name contains alphabet characters and spaces
      message: 'Name can only contain letters',
    },
  },
  passwordHash: {
    type: String,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User