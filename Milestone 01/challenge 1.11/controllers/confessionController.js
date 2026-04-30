const { DELETE_TOKEN } = require('../config/env')
const {
  validateConfessionInput,
  saveConfession,
  formatConfessionResponse,
  getAllConfessions,
  findConfessionById,
  isValidCategory,
  findConfessionsByCategory,
  deleteConfessionById
} = require('../services/confessionService')

function sendValidationError(res, validationError) {
  if (validationError.responseType === 'send') {
    return res.status(validationError.statusCode).send(validationError.payload)
  }

  return res.status(validationError.statusCode).json(validationError.payload)
}

function createConfession(req, res) {
  var confessionData = req.body
  var validationError = validateConfessionInput(confessionData)

  if (validationError) {
    return sendValidationError(res, validationError)
  }

  var savedConfession = saveConfession(confessionData)
  console.log('added one info ' + savedConfession.id)
  return res.status(201).json(formatConfessionResponse(savedConfession))
}

function getConfessions(req, res) {
  var confessionList = getAllConfessions()
  console.log('fetching all data result')
  return res.json(confessionList)
}

function getConfessionById(req, res) {
  var confessionId = parseInt(req.params.id)
  var confession = findConfessionById(confessionId)

  if (confession) {
    if (confession.text) {
      console.log('found info with ' + confession.text.length + ' chars')
      return res.json(formatConfessionResponse(confession))
    }

    return res.status(500).send('broken')
  }

  return res.status(404).json({msg: 'not found'})
}

function getConfessionsByCategory(req, res) {
  var category = req.params.cat

  if (!isValidCategory(category)) {
    return res.status(400).json({msg: 'invalid category'})
  }

  return res.json(findConfessionsByCategory(category))
}

function deleteConfession(req, res) {
  if (req.headers['x-delete-token'] !== DELETE_TOKEN) {
    return res.status(403).json({msg: 'no permission'})
  }

  if (!req.params.id) {
    return res.status(400).send('no id')
  }

  var confessionId = parseInt(req.params.id)
  var deletedConfession = deleteConfessionById(confessionId)

  if (deletedConfession) {
    console.log('deleted something')
    return res.json({msg: 'ok', item: deletedConfession})
  }

  return res.status(404).json({msg: 'not found buddy'})
}

module.exports = {
  createConfession,
  getConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession
}