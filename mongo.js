require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

const args = process.argv.slice(2)

if (args.length < 1) {
    console.log('Usage:')
    console.log('  node mongo.js <password> <name> <number>')
    console.log('  node mongo.js <password>')
    process.exit(1)
}

const password = args[0]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
    .then(() => {
        if (args.length === 1) {
            Person.find({}).then(result => {
                console.log('phonebook:')
                result.forEach(p => {
                    console.log(`${p.name} ${p.number}`)
                })
                mongoose.connection.close()
            })
        } else if (args.length === 3) {
            const name = args[1]
            const number = args[2]
            const person = new Person({ name, number })

            person.save()
                .then(saved => {
                    console.log(`added ${saved.name} number ${saved.number} to phonebook`)
                    mongoose.connection.close()
                })
                .catch(err => {
                    console.error('error saving person:', err.message)
                    mongoose.connection.close()
                })
        } else {
            console.log('Invalid arguments. Either provide only password (to list) or password, name and number (to add).')
            mongoose.connection.close()
        }
    })
    .catch(err => {
        console.error('connection error:', err.message)
    })
