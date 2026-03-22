const cache = new Map<string, { data: any; timestamp: number }>();
const TTL = 3600000; // 1 jam dalam milidetik

export const cacheService = {
  get: (key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < TTL) {
      return cached.data;
    }
    cache.delete(key);
    return null;
  },
  set: (key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
  }
};
