import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { config } from './env';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      config.NODE_ENV === 'development'
        ? [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'warn' }, { emit: 'stdout', level: 'error' }]
        : [{ emit: 'stdout', level: 'error' }],
  });

if (config.NODE_ENV === 'development') {
  prisma.$on('query', (event) => {
    if (event.duration > 500) {
      logger.warn(`Slow query (${event.duration}ms): ${event.query}`);
    }
  });
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase() {
  await prisma.$connect();
  logger.info('PostgreSQL connected');
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}