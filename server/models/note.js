const mongoose = require('mongoose')

const NoteScheme = mongoose.Schema({
    title: String,
    content: String,
    username: String,
    category: {type: String, default: 'Genera'}
})

module.exports = mongoose.model('Note', NoteScheme)