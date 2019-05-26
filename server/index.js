const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session') // session storage using mongodb
const app = express()
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/learning_notes').then(() => {console.log("Mongoose is up!")})

const User = require('./models/user')

app.use(session({secret: 'my-secret-is-good', resave: false, saveUninitialized: true}))
app.use(bodyParser.json())

app.listen(1234, "localhost", () => console.log("Server listening at localhost:1234"))

app.post('/api/isLoggedIn', (request, response) => {
    const username = request.body.username
    if (request.session && request.session.username == username) {
        response.json(request.session.auth || false)
    } else {
        response.json(false)
    }
})

app.post('/api/logout', (request, response) => {
    const username = request.body.username
    if (request.session && request.session.username == username) {
        request.session.destroy((success) => {
            response.json({success: true, message: "User logout!"})
        }, (err) => {
            response.json({success: false, message: "User failed to logout!"})
        })
    } else {
        response.json({success: false, message: "You should login first!"})
    }
})

app.post('/api/checkUser', async (request, response) => {
    const {username, password} = request.body
    const result = await User.findOne({username, password})
    if (result) {
        response.json({success: true, message: 'User found!'})
        request.session.username = username
        request.session.auth = true
        request.session.save()
    } else {
        response.json({success: false, message: 'User does not exist!'})
    }
})

app.post('/api/register', async (request, response) => {
    const {username, password} = request.body
    if (await User.findOne({username})) {
        response.json({success: false, message: 'User already exists!'})
        return
    }
    const user = new  User({
        username,
        password
    })
    await user.save((success) => {
        response.json({success: true, message: "User has been successfully registered!"})
    }, (err) => {
        response.json({success: false, message: "User failed to register!"})
    })
})