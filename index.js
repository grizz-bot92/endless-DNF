const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const morgan = require('morgan')
const Runner = require('./models/runner')

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', req => JSON.stringify(req.body))

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Body:', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)


// app.get('/api/info', (req, res) => {
//   const numberOfRunners = runners.length
//   const date = new Date()
//   res.send(`
//     <div>
//       <h1>There are ${numberOfRunners} runners signed up!</h1>
//       <p>${date.toString()}</p>
//     </div>`)
// })


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

logger.info(`Server running on ${config.PORT}`)


