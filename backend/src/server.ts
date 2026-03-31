import { app } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';
import { closeRedis } from './config/redis';
import { logger } from './utils/logger';

const boot = async () => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`BCN API listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.warn(`Received ${signal}. Starting graceful shutdown.`);
    server.close(async () => {
      await Promise.allSettled([disconnectDatabase(), closeRedis()]);
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
};

boot().catch((error) => {
  logger.error('Fatal boot error', error);
  process.exit(1);
});