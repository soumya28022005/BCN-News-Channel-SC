import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

import { config } from './config/env';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { rateLimiter } from './middlewares/rateLimiter';
import { requestLogger } from './middlewares/requestLogger';
import { startJobs } from './jobs/index';

import authRoutes from './routes/auth.routes';
import articleRoutes from './routes/article.routes';
import categoryRoutes from './routes/category.routes';
import tagRoutes from './routes/tag.routes';
import commentRoutes from './routes/comment.routes';
import mediaRoutes from './routes/media.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import seoRoutes from './routes/seo.routes';
import searchRoutes from './routes/search.routes';
import analyticsRoutes from './routes/analytics.routes';
import newsletterRoutes from './routes/newsletter.routes';
import sitemapRoutes from './routes/sitemap.routes';
import sponsorRoutes from './routes/sponsor.routes';
import settingsRoutes from './routes/settings.routes';

const app = express();
const httpServer = createServer(app);

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(compression() as any);
app.use(cookieParser() as any);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg: string) => logger.info(msg.trim()) },
    })
  );
}
app.use(requestLogger);

app.use('/api/', rateLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'BCN API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

const API = '/api/v1';

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/articles`, articleRoutes);
app.use(`${API}/categories`, categoryRoutes);
app.use(`${API}/tags`, tagRoutes);
app.use(`${API}/comments`, commentRoutes);
app.use(`${API}/media`, mediaRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/admin`, adminRoutes);
app.use(`${API}/seo`, seoRoutes);
app.use(`${API}/search`, searchRoutes);
app.use(`${API}/analytics`, analyticsRoutes);
app.use(`${API}/newsletter`, newsletterRoutes);
app.use(sitemapRoutes);
app.use(`${API}/sponsor`, sponsorRoutes);
app.use(`${API}/settings`, settingsRoutes);

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  try {
    await connectDatabase();
    logger.info('✅ PostgreSQL connected');

    try {
      await connectRedis();
      logger.info('✅ Redis connected');
    } catch {
      logger.warn('⚠️ Redis unavailable, continuing without cache');
    }

    startJobs();

    httpServer.listen(config.PORT, '0.0.0.0', () => {
      logger.info(`🚀 BCN API running on port ${config.PORT}`);
      logger.info(`📡 Environment: ${config.NODE_ENV}`);
      logger.info(`🌐 API Base: http://localhost:${config.PORT}${API}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default app;
