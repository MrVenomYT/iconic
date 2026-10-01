// In-memory mock for quick.db to avoid native SQLite compilation dependencies
const store = new Map();

const db = {
  fetch: (key) => store.get(key) ?? null,
  get: (key) => store.get(key) ?? null,
  set: (key, val) => {
    store.set(key, val);
    return val;
  },
  delete: (key) => store.delete(key),
  has: (key) => store.has(key),
  all: () => Array.from(store.entries()).map(([ID, data]) => ({ ID, data })),
  push: (key, val) => {
    const list = store.get(key) || [];
    list.push(val);
    store.set(key, list);
    return list;
  }
};

module.exports = db;
