import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

function buildMessage(message: string) {
  return { success: false, statusCode: 429, message };
}

export const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: buildMessage('Too many requests, please try again later.'),
  skip: (req) => req.method === 'GET' || req.path === '/health',
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8, // limit komate hbe
  standardHeaders: true,
  legacyHeaders: false,
  message: buildMessage('Too many login attempts. Please wait and try again.'),
});