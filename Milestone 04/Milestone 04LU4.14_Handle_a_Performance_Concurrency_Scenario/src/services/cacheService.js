const cache = new Map();

function setCache(key, data, ttl = 60000) {
  if (data === null || data === undefined) {
    return;
  }

  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
}

function getCache(key) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiry <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function deleteCache(key) {
  cache.delete(key);
}

module.exports = {
  setCache,
  getCache,
  deleteCache,
};