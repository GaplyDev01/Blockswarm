import { Redis } from '@upstash/redis';

// Default cache TTL in seconds (5 minutes)
export const DEFAULT_CACHE_TTL = 60 * 5;

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_URL || process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
  // Optional read-only token for improved security in read operations
  readOnlyToken: process.env.KV_REST_API_READ_ONLY_TOKEN,
});

/**
 * Retrieves cached data for a given key
 * @param key - The cache key
 * @returns The cached data or null if not found
 */
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get<T>(key);
    if (data) {
      console.log(`Cache hit for key: ${key}`);
      return data;
    }
    console.log(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    console.error(`Error retrieving cached data for key ${key}:`, error);
    return null;
  }
};

/**
 * Stores data in the cache with a TTL
 * @param key - The cache key
 * @param data - The data to cache
 * @param ttl - Time to live in seconds
 * @returns Whether the operation was successful
 */
export const setCachedData = async <T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_CACHE_TTL
): Promise<boolean> => {
  try {
    await redis.set(key, data, { ex: ttl });
    console.log(`Data cached for key: ${key} with TTL: ${ttl}s`);
    return true;
  } catch (error) {
    console.error(`Error caching data for key ${key}:`, error);
    return false;
  }
};

/**
 * Deletes cached data for a given key
 * @param key - The cache key
 * @returns Whether the operation was successful
 */
export const deleteCachedData = async (key: string): Promise<boolean> => {
  try {
    const result = await redis.del(key);
    const success = result === 1;
    if (success) {
      console.log(`Cache entry deleted for key: ${key}`);
    } else {
      console.log(`No cache entry found for key: ${key}`);
    }
    return success;
  } catch (error) {
    console.error(`Error deleting cached data for key ${key}:`, error);
    return false;
  }
};

/**
 * Checks if a key exists in the cache
 * @param key - The cache key
 * @returns Whether the key exists
 */
export const keyExists = async (key: string): Promise<boolean> => {
  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`Error checking if key ${key} exists:`, error);
    return false;
  }
};

/**
 * Gets the remaining TTL for a key in seconds
 * @param key - The cache key
 * @returns The remaining TTL in seconds, -2 if the key doesn't exist, -1 if the key exists but has no TTL
 */
export const getKeyTTL = async (key: string): Promise<number> => {
  try {
    const ttl = await redis.ttl(key);
    return ttl;
  } catch (error) {
    console.error(`Error getting TTL for key ${key}:`, error);
    return -2; // Return -2 to indicate error (same as Redis does for non-existent keys)
  }
};

export default redis; 