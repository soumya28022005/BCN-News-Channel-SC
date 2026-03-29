import Redis from 'ioredis';
import { config } from './env';
import { logger } from '../utils/logger';

let redisClient: Redis;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          logger.error('Redis retry limit exceeded');
          return null;
        }
        return Math.min(times * 200, 1000);
      },
      reconnectOnError(err) {
        logger.warn('Redis reconnecting due to error:', err.message);
        return true;
      },
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis error:', err.message);
    });
  }

  return redisClient;
}

export async function connectRedis() {
  const client = getRedisClient();
  await client.ping();
}