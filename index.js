const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('./db-config')
const secrets = require('./config/secrets')

const server = express()

server.use(express.json())

server.post('/api/register', (req, res) => {
    const credentials = req.body
    const hash = bcrypt.hashSync(credentials.password, 12)
    credentials.password = hash
    db('users').insert(req.body)
        .then(()=>{
            res.status(201).json({message: "user successfully created"})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: "could not add to database"})
        })
})

server.post('/api/login', (req, res) => {
    let { username, password } = req.body

    db('users').where('username', username)
        .first()
        .then(user =>{
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                res.status(200).json({
                    message: "successful login",
                    token
                })
            } else {
                res.status(401).json({ message: "invalid credentials"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "database error"})
        })
})

server.get('/api/users', validateToken, (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: "could not get from database"})
        })
})

server.listen(5000, () => {
    console.log(`server listening on port 5000`)
})


function validateToken(req, res, next){
    const [authType, token] = req.headers.authorization.split(' ')

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: "invalid token"})
            } else {
                req.decodedJwt = decodedToken
                next()
            }
        })
    } else {
        res.status(401).json({message: 'no token incuded'})
    }
}


function generateToken(user){
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    }

    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}