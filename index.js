const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan('tiny'))
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('---');
  next()
}

app.use(requestLogger);

const date = new Date();

let runners = [
  {
    id: "1",
    name: "Brandon",
    bib_number: "45",
    checked_in: true,
  },
  {
    id: "2",
    name: "Nicole",
    bib_number: "46",
    checked_in: false,
  },
  {
    id: "3",
    name: "Bella",
    bib_number: "47",
    checked_in: true,
  },
  {
    id: "4",
    name: "Bongo",
    bib_number: "48",
    checked_in: false,
  },
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/runners', (req, res) => {
  res.json(runners)
})

app.get('/api/info', (req, res) => {
  res.send(`
    <div>
      <h1>There are ${runners.length} runners signed up!</h1>
      <p>${date.toString()}</p>
    </div>`)
})

app.get('/api/runners/:id', (req, res) => {
  const id = req.params.id
  const runner = runners.find(runner => runner.id === id)
  
  if(runner){
    res.json(runner)
  } else {
    res.statusMessage = "Runner not found by Id"
    res.status(404).end()
  } 
})

app.delete('/api/runners/:id', (req, res) => {
  const id = req.params.id
  runners = runners.filter(runner => runner.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = runners.length > 0 
  ? Math.max(...runners.map(runner => Number = (runner.id)))
  : 0

  return String(maxId + 1)
}

app.post('/api/runners', (req, res) => {
  const body = req.body

  if(!body.content){
    return res.status(400).json({
      error: "content missing"
    })
  }
  
  const runner = {
    name: body.content,
    bib_number: body.content,
    checked_in: body.checked_in || false,
    id: generateId(),
  }

  
  runners = runners.concat(runner)

  res.json(runner)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


