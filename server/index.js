const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session') // session storage using mongodb
const app = express()
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/learning_notes').then(() => {console.log("Mongoose is up!")})

const User = require('./models/user')
const Note = require('./models/note')
const Category = require('./models/category')

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
    const user = new User({
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
    const {title, content, username, category} = req.body
    const note = new Note({
        title,
        content,
        username,
        category
    })
    await note.save(_=> {
        res.json({success: true, message: "Note has been successfully added!"})
    }, (err) => {
        res.json({success: false, message: "Note failed to add!"})
    })
})

app.get('/api/notes', async (req, res) => {
    const username = req.query.username
    const category = req.query.categoryName
    const allNotes = category == null ? await Note.find({username}) : await Note.find({username, category})
    res.json(allNotes)
})

app.put('/api/notes/:id', async (req, res) => {
    const id = req.params.id
    const {title, content, username, category} = req.body
    const note = await Note.findById({_id: id})
    if (username !== note.username) {
        return res.json({success: false, message: "You can only update your notes!"})
    }

    Note.update({_id: id}, {title, content, category}, ((err, raw)=> {
        if (err) {
            return res.json({success: false, message: "Note failed to update!", trace: err})
        }
        if (raw.n > 0) {
            res.json({success: true, message: "Note has been successfully updated!", trace: raw})
        } else {
            res.json({success: false, message: "Cannot find this note!", trace: raw})
        }
    }))
})

app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id
    const username = req.query.username
    const note = await Note.findById(id)
    if (note) {
        if (username !== note.username) {
            return res.json({success: false, message: "You can only delete your notes!"})
        }
    }

    Note.deleteOne({_id: id}, ((err, raw) => {
        if (err) {
            return res.json({success: false, message: "Note failed to delete!", trace: err})
        }
        if (raw.n > 0) {
            res.json({success: true, message: "Note has been successfully deleted!", trace: raw})
        } else {
            res.json({success: false, message: "Cannot find this note!", trace: raw})
        }
    }))
})

app.post('/api/categories', async (req, res) => {
    const {name, username} = req.body
    const category = new Category({
       name,
       username
    })
    await category.save(_=> {
        res.json({success: true, message: "Category has been successfully added!"})
    }, (err) => {
        res.json({success: false, message: "Category failed to add!"})
    })
})

app.get('/api/categories', async (req, res) => {
    const username = req.query.username
    const allCategories = await Category.find({username})
    res.json(allCategories)
})

app.put('/api/categories/:id', async (req, res) => {
    const id = req.params.id
    const {name, username} = req.body
    const category = await Category.findById({_id: id})
    if (username !== category.username) {
        return res.json({success: false, message: "You can only update your categories!"})
    }

    Category.update({_id: id}, {name}, ((err, raw)=> {
        if (err) {
            return res.json({success: false, message: "Category failed to update!", trace: err})
        }
        if (raw.n > 0) {
            res.json({success: true, message: "Category has been successfully updated!", trace: raw})
        } else {
            res.json({success: false, message: "Cannot find this category!", trace: raw})
        }
    }))
})

app.delete('/api/categories/:id', async (req, res) => {
    const id = req.params.id
    const username = req.query.username
    const category = await Category.findById(id)
    if (category) {
        if (username !== category.username) {
            return res.json({success: false, message: "You can only delete your category!"})
        }
    }

    Category.deleteOne({_id: id}, ((err, raw) => {
        if (err) {
            return res.json({success: false, message: "Category failed to delete!", trace: err})
        }
        if (raw.n > 0) {
            res.json({success: true, message: "Category has been successfully deleted!", trace: raw})
        } else {
            res.json({success: false, message: "Cannot find this category!", trace: raw})
        }
    }))
})