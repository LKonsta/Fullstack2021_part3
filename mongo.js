require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
  
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }
  
if (process.argv.length === 3) {
  
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name  + " " + person.number)
    })
    mongoose.connection.close()
  }) 
}

if (process.argv.length === 5) {
  const name = process.argv[3]

  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })
  
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

