const express = require('express')
const app = express()
const port = 5000

const cors = require('cors')
const connectToMongo = require('./db')
app.use(cors())
app.use(express.json())

connectToMongo();


app.use('/api/auth', require("./routes/auth"));
app.use('/api/image', require('./routes/image'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})