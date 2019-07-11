const mongoose = require('mongoose')

const NoteScheme = mongoose.Schema({
    title: String,
    content: String,
    username: String
})

module.exports = mongoose.model('Note', NoteScheme)