const express = require('express')
const app = express()

const morgan = require('morgan')

const cors = require('cors')
app.use(cors())


app.use(express.json())


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

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": "5",
        "name": "saad hannna",
        "number": "39-23-6423122"
    },

]



app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {

    const date = new Date()

    res.send(`
        <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        </div>
        `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)

    const person = persons.find(p => p.id === id)


    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()

})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        })
    }

    const nameExists = persons.find(p => p.name === body.name)
    if (nameExists) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = Math.floor(Math.random() * 1000000).toString()

    const newPerson = {
        id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
