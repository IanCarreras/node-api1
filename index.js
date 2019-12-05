// implement your API here
const express = require('express')
const {  find, findById, insert, update, remove} = require('./data/db')

const port = 8080
const host = '127.0.0.1'
const app = express()

app.use(express.json())


app.listen(port, host, () => {
    console.log(`server running at http://${host}:${port}`)
})

app.post('/api/users', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
    }

    db.insert(req.body)
    res.status(201)
})

app.get('/api/users', (req, res) => {
    find().then(users => {
        if (users) {
            res.json(users)
        } else {
            res.status(500).json({ errorMessage: 'The users information could not be retrieved.'})
        }
    })
})

app.get('/api/users/:id', (req, res) => {
    findById(req.params.id).then(user => {
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.'})
        }
    })
})

app.delete('/api/users/:id', (req, res) => {
    remove(req.params.id).then(deleted => {
        if (deleted === 0) {
            res.status(404).json({ message: 'The user with the specified ID does not exist.'})
        } else {
            res.status(200).json({ message: 'deleted'})
        }
    })
})

app.put('/api/users/:id', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'})
    }

    update(req.params.id, req.body).then(updated => {
        if (updated === 0) {
            res.status(404).json({ message: 'The user with the specified ID does not exist.'})
        } else if (updated === 1) {
            findById(req.params.id).then(user => {
                res.status(200).json(user)
            })
        }
    })
    
})