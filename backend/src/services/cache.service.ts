import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

function serialize(value: unknown) {
  return JSON.stringify(value, (_key, current) => (typeof current === 'bigint' ? current.toString() : current));
}

export class CacheService {
  private client = getRedisClient();

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const raw = await this.client.get(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      logger.warn(`Cache get failed for ${key}: ${(error as Error).message}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300) {
    try {
      await this.client.set(key, serialize(value), 'EX', ttlSeconds);
    } catch (error) {
      logger.warn(`Cache set failed for ${key}: ${(error as Error).message}`);
    }
  }

  async del(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.warn(`Cache delete failed for ${key}: ${(error as Error).message}`);
    }
  }

  async invalidatePattern(pattern: string) {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length) await this.client.del(...keys);
      } while (cursor !== '0');
    } catch (error) {
      logger.warn(`Cache invalidate failed for ${pattern}: ${(error as Error).message}`);
    }
  }
}