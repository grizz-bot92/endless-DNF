const runnerRouter = require('express').Router()
const Runner = require('../models/runner')

runnerRouter.get('/', (req, res) => {
  Runner.find({})
    .then(runners =>
      res.json(runners)
    )
})

runnerRouter.get('/:id', (req, res, next) => {
  Runner.findById(req.params.id)
    .then(runner => {
      if(runner){
        res.json(runner)
      }else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

runnerRouter.post('/', (req, res, next) => {
  const body = req.body

  if(!body.name){
    return res.status(400).json({
      error: 'Name of the runner is missing'
    })
  }

  Runner.findOne({ bib_number: body.bib_number })
    .then(bibExist => {
      if(bibExist){
        return res.status(400).json({
          error: 'Runner already exists'
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

runnerRouter.put('/:id', (req, res, next) => {
  const { name, bib_number, checked_in } = req.body

  Runner.findById(req.params.id)
    .then(runner => {
      if(!runner){
        res.status(404).end()
      }

      runner.name = name
      runner.bib_number = bib_number
      runner.checked_in = checked_in

      return runner.save()
        .then((upDatedRunner) => {
          res.json(upDatedRunner)
        })
    })
    .catch(error => next(error))
})

runnerRouter.delete(':/id', (req, res, next) => {
  Runner.findByIdAndDelete(req.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => next(error))
})