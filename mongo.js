const { urlencoded } = require('express')
const mongoose = require('mongoose')


if(process.argv.length < 3){
  console.log('give password as argument');
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://bbenoit752_db_user:${password}@cluster0.xh2f2hy.mongodb.net/endlessDNF?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const runnerSchema = new mongoose.Schema({
  name: String,
  bib_number: String,
  checked_in: Boolean,
})

const Runner = mongoose.model('Runner', runnerSchema);

const runner = new Runner({
  name: 'Jen',
  bib_number: "53",
  checked_in: false,
})


// runner.save().then(result => {
//   console.log('runner saved!')
//   mongoose.connection.close()
// })

Runner.find({}).then(result => {
  result.forEach(runner => {
    console.log(runner)
  })
  mongoose.connection.close()
})