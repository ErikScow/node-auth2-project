const express = require('express')
const bcrypt = require('bcryptjs')

const server = express()

server.use(express.json())

server.post('/api/register', (req, res) => {

})

server.post('/api/login', (req, res) => {

})

server.get('/api/users', (req, res) => {

})

server.listen(5000, () => {
    console.log(`server listening on port 5000`)
})