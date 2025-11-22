require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


// create custom token
morgan.token('post-data', (req) => {
    return req.method === 'POST'
        ? JSON.stringify(req.body)
        : ""
})

//  custom format 
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :post-data')
)


app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(err => next(err))
})


app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            res.send(`
        <div>
          <p>Phonebook has info for ${count} people</p>
          <p>${new Date()}</p>
        </div>
      `)
        })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) res.json(person)
            else res.status(404).end()
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(err => next(err))
})


app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: "query" }
    )
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(err => next(err))
})



const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {

        return res.status(400).send({ error: 'malformatted id' })

    } else if (error.name === 'ValidationError') {

        return res.status(400).json({ error: error.message })

    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
