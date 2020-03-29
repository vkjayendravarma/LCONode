const express = require('express')


const app = express()



app.get('/', (req, res)=>{
    res.send('server check')
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log("http://localhost:" + port))