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

app.post('/api/user', async (request, response) => {
    let {username, password} = request.body
    let result = await User.findOne({username, password})
    if (result) {
        return response.json({success: true})
    } else {
        return response.json({success: false})
    }
})

app.post('/api/register', (request, response) => {
    let {username, password} = request.body
    let user = new  User({
        username: username,
        password: password
    })
    user.save(function(err, res) {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }
    })
    return response.json({success: true})
})