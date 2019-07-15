const mongoose = require('mongoose')

const CategoryScheme = mongoose.Schema({
    name: String,
    username: String
})

module.exports = mongoose.model('Category', CategoryScheme)