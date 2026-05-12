// Simple in-memory cache for Cloudflare Workers (persists as long as isolate is warm)
const cacheMap = new Map<string, { value: unknown; expires: number }>();

export const getCache = <T>(key: string): T | undefined => {
  const item = cacheMap.get(key);
  if (!item) return undefined;
  
  if (Date.now() > item.expires) {
    cacheMap.delete(key);
    return undefined;
  }
  
  return item.value as T;
};

export const setCache = <T>(key: string, value: T, ttlSeconds: number = 3600): void => {
  cacheMap.set(key, {
    value,
    expires: Date.now() + (ttlSeconds * 1000)
  });
};

export const deleteCache = (key: string): void => {
  cacheMap.delete(key);
};

export const clearCache = (): void => {
  cacheMap.clear();
};

export default cacheMap;
