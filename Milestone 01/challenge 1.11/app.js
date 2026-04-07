require('dotenv').config()

const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')
const { API_PREFIX } = require('./config/env')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
// Keep bootstrap logic here so routing and business rules stay isolated.
app.use(`${API_PREFIX}/confessions`, confessionRoutes)

app.listen(PORT, function() {
  console.log(`running on ${PORT}`)
})
