require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./mongo')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

morgan.token('content', function(req, res) {
  if (req.body) {
    return (JSON.stringify(req.body));
  }
  return("")
});



let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
  ]

  app.get('/info', (request, response) => {
    var currentdate = new Date(); 
    response.send('<p>Phonebook has info for 4 people</p><p>' + currentdate + '</p>')
  })
  
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(pesons => {
      response.json(persons)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'name or number is missing'
      })
    } else if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name is already in the phonebook'
      })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * Math.floor(100000000))
    }

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })