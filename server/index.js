const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session') // session storage using mongodb
const app = express()
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/learning_notes').then(() => {console.log("Mongoose is up!")})

const User = require('./models/user')

app.use(session({secret: 'abc123', resave: true, saveUninitialized: true}))
app.use(bodyParser.json())

app.listen(1234, "localhost", () => console.log("Server listening at localhost:1234"))

app.post('/api/checkUser', async (request, response) => {
    let {username, password} = request.body
    let result = await User.findOne({username, password})
    if (result) {
        response.send({success: true, message: 'User found!'})
    } else {
        response.send({success: false, message: 'User does not exist!'})
    }
})

app.post('/api/register', async (request, response) => {
    let {username, password} = request.body
    if (await User.findOne({username})) {
        return response.json({success: false, message: 'User already exists!'})
    }
    let user = new  User({
        username,
        password
    })
    await user.save()
    response.send({success: true, message: 'User has been successfully registered!'})
})