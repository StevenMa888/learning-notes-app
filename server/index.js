const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session') // session storage using mongodb
const app = express()

app.use(session({secret: 'abc123', resave: true, saveUninitialized: true}))
app.use(bodyParser.json())

app.listen(1234, "localhost", () => console.log("Server listening at localhost:1234"))

app.get('/api/isLoggedIn', (request, response) => {
    return response.json({ status: false })
})

app.post('/api/register', (request, response) => {
    const body = request.body
    return response.json( { username: body.username, password: body.password } )
})