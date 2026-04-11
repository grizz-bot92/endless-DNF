require('dotenv').config()
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

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/runners', (req, res) => {
  Runner.find({}).then(runners => {
    res.json(runners)
  })
})

// app.get('/api/info', (req, res) => {
//   const numberOfRunners = runners.length
//   const date = new Date()
//   res.send(`
//     <div>
//       <h1>There are ${numberOfRunners} runners signed up!</h1>
//       <p>${date.toString()}</p>
//     </div>`)
// })

app.get('/api/runners/:id', (req, res, next) => {
  Runner.findById(req.params.id)
    .then((runner) => {
      if(runner) {
        res.json(runner)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/runners', (req, res, next) => {
  const body = req.body

  if(!body.name){
    return res.status(400).json({
      error: 'name of runner missing'
    })
  }

  Runner.findOne({ bib_number: body.bib_number })
    .then(bibExists => {
      if(bibExists){
        return res.status(400).json({
          error: 'runner already exists'
        })
      }

      const runner = new Runner({
        name: body.name,
        bib_number: body.bib_number,
        checked_in: body.checked_in || false,
      })

      return runner.save()
        .then((savedRunner) => {
          res.json(savedRunner)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

app.put('/api/runners/:id', (req, res, next) => {
  const { name, bib_number, checked_in } = req.body

  Runner.findById(req.params.id)
    .then(runner => {
      if(!runner) {
        return res.status(404).end()
      }

      runner.name = name
      runner.bib_number = bib_number
      runner.checked_in = checked_in

      return runner.save().then((updatedRunner) => {
        res.json(updatedRunner)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/runners/:id', (req, res, next) => {
  Runner.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

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


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


