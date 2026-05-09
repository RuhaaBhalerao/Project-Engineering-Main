const PORT = process.env.PORT || 3000
const API_PREFIX = process.env.API_PREFIX || '/api/v1'
const DELETE_TOKEN = process.env.DELETE_TOKEN || 'supersecret123'

module.exports = {
  PORT,
  API_PREFIX,
  DELETE_TOKEN
}