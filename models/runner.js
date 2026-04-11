const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(res => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB:', err.message)
  })

const runnerSchema = new mongoose.Schema({
  name: String,
  bib_number: String,
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