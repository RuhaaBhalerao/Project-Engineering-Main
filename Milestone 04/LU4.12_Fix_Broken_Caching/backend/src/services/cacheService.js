const DEFAULT_TTL_MS = 60 * 1000;
const SWEEP_INTERVAL_MS = 30 * 1000;

class CacheService {
  constructor(ttlMs = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs;
    this.store = new Map();

    this.sweeper = setInterval(() => {
      this.pruneExpired();
    }, SWEEP_INTERVAL_MS);

    if (typeof this.sweeper.unref === 'function') {
      this.sweeper.unref();
    }
  }

  taskKey(id) {
    return `task:${id}`;
  }

  tasksListKey() {
    return 'tasks:list';
  }

  get(key) {
    const entry = this.store.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key, value, ttlMs = this.ttlMs) {
    if (value === null || value === undefined) {
      return false;
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });

    return true;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  pruneExpired() {
    const now = Date.now();

    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }
}

module.exports = new CacheService();