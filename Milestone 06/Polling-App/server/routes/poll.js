const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const db = require('../data')

router.get('/poll', verifyToken, (req, res) => {
  res.json(db.poll)
})

router.post('/vote', verifyToken, (req, res) => {
  const { optionId } = req.body
  const userId = req.user.id

  // Use type-safe membership check. votedUserIds stores numeric ids.
  if (db.poll.votedUserIds.includes(userId)) {
    return res.status(400).json({ error: 'Already voted' })
  }

  const opt = db.poll.options.find(o => o.id === optionId)
  if (!opt) return res.status(404).json({ error: 'Option not found' })
  opt.votes += 1
  // store numeric id (simulate using user id)
  db.poll.votedUserIds.push(req.user.id)
  res.json({ success: true, poll: db.poll })
})

module.exports = router
