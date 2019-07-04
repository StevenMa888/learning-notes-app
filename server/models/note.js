const mongoose = require('mongoose')

const NoteScheme = mongoose.Schema({
    title: String,
    content: String
})

module.exports = mongoose.model('Note', NoteScheme)