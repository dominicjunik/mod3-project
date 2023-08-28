// enabling .env file to hide the server information
require('dotenv').config()

// importing express to run our server saving it in App to use
const express = require('express')
const app = express()

//importing cors so our server can talk to the react app
const cors = require('cors')

// setting a fixed port
const PORT = 8080 

// connect to the database through the function in the config.js
const connectDB = require('./config')
connectDB()

// When the routes are set up we can import them here
const userRoutes = require('./routes/userRoutes')

// middleware for the json
app.use(express.json())
// so react can talk with our server
app.use(cors())

// ultra simple route to test functionality
app.get('/', (req, res) => {res.send('Server says Hi!')})

// after the routes are imported we can set up their directions here
app.use('/api/users', userRoutes)



// tells our server where to listen to 
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT)
})
