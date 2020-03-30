const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


// all routes here
const auth = require('./routes/api/auth')
const questions = require('./routes/api/questions')
const profile = require('./routes/api/profile')


// app init
const app = express()

// middleware 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// mongoDB config
const db = require('./setup/dbconfig').mongoURL

// connect to mongo db server
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected'))
        .catch((err) => console.error(err));



// app testing route    
app.get('/', (req, res)=>{
    res.send('server check')
})

app.use('/api/auth', auth)

app.use('/api/questions', questions)

app.use('/api/profile', profile)


const port = process.env.PORT || 3000
app.listen(port, () => console.log("http://localhost:" + port))