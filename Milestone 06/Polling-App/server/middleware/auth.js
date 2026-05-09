const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shh')
    req.user = decoded
    next()
  } catch (err) {
    // Return 401 for expired tokens so the client can react to session end
    if (err && err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    // Other token errors — unauthorized
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { verifyToken }
