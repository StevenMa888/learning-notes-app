const mongoose = require('mongoose')

const UserScheme = mongoose.Schema({
    username: String,
    password: String,
    description: {type: String, default: ''},
    avatarUrl: {type: String, default: ''}
})

module.exports = mongoose.model('User', UserScheme)