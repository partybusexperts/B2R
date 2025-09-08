// Simple in-memory TTL cache for server routes. Not persisted across instances.
type CacheEntry = { value: unknown; expiresAt: number };
const store = new Map<string, CacheEntry>();

export function setCache(key: string, value: unknown, ttlSeconds = 30) {
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function getCache<T = unknown>(key: string): T | null {
  const e = store.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    store.delete(key);
    return null;
  }
  return e.value as T;
}
