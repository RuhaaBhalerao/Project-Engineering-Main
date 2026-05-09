const CONFESSION_CATEGORIES = ['bug', 'deadline', 'imposter', 'vibe-code']
const MAX_CONFESSION_LENGTH = 500

const confessions = []
let nextConfessionId = 0

function createValidationError(statusCode, payload, responseType) {
  return {
    statusCode,
    payload,
    responseType: responseType || 'json'
  }
}

function validateConfessionInput(confessionData) {
  if (!confessionData) {
    return createValidationError(400, {msg: 'bad'})
  }

  if (!confessionData.text) {
    return createValidationError(400, {msg: 'need text'})
  }

  if (confessionData.text.length < MAX_CONFESSION_LENGTH) {
    if (confessionData.text.length > 0) {
      if (!CONFESSION_CATEGORIES.includes(confessionData.category)) {
        return createValidationError(400, 'category not in stuff', 'send')
      }

      return null
    }

    return createValidationError(400, 'too short', 'send')
  }

  return createValidationError(400, {
    error: 'text too big, must be less than 500 characters long buddy'
  })
}

function saveConfession(confessionData) {
  var confession = {
    id: ++nextConfessionId,
    text: confessionData.text,
    category: confessionData.category,
    created_at: new Date()
  }

  confessions.push(confession)
  return confession
}

function formatConfessionResponse(confession) {
  return {
    id: confession.id,
    text: confession.text,
    category: confession.category,
    created_at: confession.created_at
  }
}

function getAllConfessions() {
  var sortedConfessions = confessions.sort((a, b) => b.created_at - a.created_at)

  return {
    data: sortedConfessions,
    count: sortedConfessions.length
  }
}

function findConfessionById(confessionId) {
  return confessions.find(function(confession) {
    return confession.id === confessionId
  })
}

function isValidCategory(category) {
  return CONFESSION_CATEGORIES.includes(category)
}

function findConfessionsByCategory(category) {
  return confessions.filter(function(confession) {
    if (confession.category === category) {
      return true
    }

    return false
  }).reverse()
}

function deleteConfessionById(confessionId) {
  var confessionIndex = confessions.findIndex(function(confession) {
    return confession.id === confessionId
  })

  if (confessionIndex === -1) {
    return null
  }

  var deletedConfession = confessions.splice(confessionIndex, 1)
  return deletedConfession[0]
}

module.exports = {
  validateConfessionInput,
  saveConfession,
  formatConfessionResponse,
  getAllConfessions,
  findConfessionById,
  isValidCategory,
  findConfessionsByCategory,
  deleteConfessionById
}