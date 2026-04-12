const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const runnerSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    required: true,
  },
  bib_number: {
    type: String,
    minLength: 1,
    unique: true,
    required: true,
    description: 'Bib number must be unique'
  },
  checked_in: Boolean,
})

runnerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Runner', runnerSchema)