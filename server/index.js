const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session') // session storage using mongodb
const app = express()
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/learning_notes').then(() => {console.log("Mongoose is up!")})

const User = require('./models/user')
const Note = require('./models/note')

app.use(session({secret: 'my-secret-is-good', resave: false, saveUninitialized: true}))
app.use(bodyParser.json())

app.listen(1234, "localhost", () => console.log("Server listening at localhost:1234"))

app.post('/api/isLoggedIn', (req, res) => {
    const {username} = req.body
    if (req.session && req.session.username == username) {
        res.json(req.session.auth || false)
    } else {
        res.json(false)
    }
})

app.post('/api/logout', (req, res) => {
    const {username} = req.body
    if (req.session && req.session.username == username) {
        req.session.destroy(_ => {
            res.json({success: true, message: "User logout!"})
        }, (err) => {
            res.json({success: false, message: "User failed to logout!"})
        })
    } else {
        res.json({success: false, message: "You should login first!"})
    }
})

app.post('/api/checkUser', async (req, res) => {
    const {username, password} = req.body
    const result = await User.findOne({username, password})
    if (result) {
        res.json({success: true, message: 'User found!'})
        req.session.username = username
        req.session.auth = true
        req.session.save()
    } else {
        res.json({success: false, message: 'User does not exist!'})
    }
})

app.post('/api/register', async (req, res) => {
    const {username, password} = req.body
    if (await User.findOne({username})) {
        res.json({success: false, message: 'User already exists!'})
        return
    }
    const user = new  User({
        username,
        password
    })
    await user.save(_ => {
        res.json({success: true, message: "User has been successfully registered!"})
    }, (err) => {
        res.json({success: false, message: "User failed to register!"})
    })
})

app.post('/api/notes', async (req, res) => {
    const {title, content} = req.body
    console.log(title, content)
    const note = new Note({
        title,
        content
    })
    await note.save(_=> {
        res.json({success: true, message: "Note has been successfully added!"})
    }, (err) => {
        res.json({success: false, message: "Note failed to add!"})
    })
})

app.get('/api/notes', async (req, res) => {
    allNotes = await Note.find()
    res.json(allNotes)
})