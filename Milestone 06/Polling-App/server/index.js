const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const { verifyToken } = require('./middleware/auth')
const pollRoutes = require('./routes/poll')
app.use('/api', pollRoutes)

app.post('/api/login', (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'email required' })
  const user = { id: 1, email }
  const token = jwt.sign(user, process.env.JWT_SECRET || 'shh', { expiresIn: '1m' })
  res.json({ token, user })
})

app.listen(PORT, () => console.log('Server listening on', PORT))
