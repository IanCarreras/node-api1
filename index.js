// implement your API here
const express = require('express')
const cors = require('cors')
const {  find, findById, insert, update, remove} = require('./data/db')

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'
const app = express()

app.use(express.json())
app.use(cors())

app.listen(port, host, () => {
    console.log(`server running at http://${host}:${port}`)
})

app.get("/", (req, res) => {
	res.json({
		message: "Welcome to our API",
		cohort: process.env.cohort,
	})
})

app.post('/api/users', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
    }

    insert(req.body)
        .then(id => {
            if (id) {
                findById(id.id).then(user => res.status(201).json(user))
            } else {
                res.status(500).json({ errorMessage: 'There was an error while saving the user to the database'})
            }
            
        })
})

app.get('/api/users', (req, res) => {
    find()
        .then(users => {
            if (users) {
                res.json(users)
            } else {
                res.status(500).json({ errorMessage: 'The users information coud not be retrieved.'})
            }
        })
})

app.get('/api/users/:id', (req, res) => {
    findById(req.params.id)
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.status(404).json({ message: 'The user with the specified ID does not exist.'})
            }
        })
        .catch(err => res.status(500).json({ errorMessage: 'The user information could not be retrieved.'}))
})

app.delete('/api/users/:id', (req, res) => {
    remove(req.params.id)
        .then(deleted => {
            if (deleted === 0) {
                res.status(404).json({ message: 'The user with the specified ID does not exist.'})
            } else {
                res.status(200).json({ message: 'deleted'})
            }
        })
        .catch(err => res.status(500).json({ errorMessage: 'The user could not be removed'}))
})

app.put('/api/users/:id', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'})
    }

    update(req.params.id, req.body)
        .then(updated => {
            if (updated === 0) {
                res.status(404).json({ message: 'The user with the specified ID does not exist.'})
            } else if (updated === 1) {
                findById(req.params.id).then(user => {
                    res.status(200).json(user)
                })
            }
        })
        .catch(err => res.status(500).json({ errorMessage: 'The use information could not be modified.'}))
})