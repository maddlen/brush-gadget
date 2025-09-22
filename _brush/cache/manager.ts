type CacheEntry<T> = {
  value: T;
  expiresAt?: number;
};

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  /** Store a value with optional TTL (ms) */
  set<T>(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: ttl ? Date.now() + ttl : undefined,
    };
    this.cache.set(key, entry);
  }

  /** Retrieve a value if it exists and isn’t expired */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key); // expire it
      return undefined;
    }

    return entry.value;
  }

  /** Check if a key is present and valid */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /** Remove a key */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /** Clear all values */
  clear(): void {
    this.cache.clear();
  }
}
