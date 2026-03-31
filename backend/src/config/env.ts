import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function toBool(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return value === 'true';
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PROD: (process.env.NODE_ENV || 'development') === 'production',
  PORT: parseInt(process.env.PORT || '8000', 10),

  DATABASE_URL: requireEnv('DATABASE_URL'),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),

  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
  COOKIE_SECURE: toBool(
    process.env.COOKIE_SECURE,
    (process.env.NODE_ENV || 'development') === 'production'
  ),
  COOKIE_SAME_SITE: (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none',
  ACCESS_COOKIE_NAME: process.env.ACCESS_COOKIE_NAME || 'bcn_access',
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME || 'bcn_refresh',
  ACCESS_COOKIE_MAX_AGE_MS: parseInt(
    process.env.ACCESS_COOKIE_MAX_AGE_MS || `${15 * 60 * 1000}`,
    10
  ),
  REFRESH_COOKIE_MAX_AGE_MS: parseInt(
    process.env.REFRESH_COOKIE_MAX_AGE_MS || `${7 * 24 * 60 * 60 * 1000}`,
    10
  ),

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@bengalchronicle.com',

  SITE_URL: process.env.SITE_URL || 'https://your-domain.com',
  SITE_NAME: 'BCN - The Bengal Chronicle Network',

  CACHE_TTL_ARTICLES: parseInt(process.env.CACHE_TTL_ARTICLES || '300', 10),
  CACHE_TTL_CATEGORIES: parseInt(process.env.CACHE_TTL_CATEGORIES || '3600', 10),
  CACHE_TTL_TRENDING: parseInt(process.env.CACHE_TTL_TRENDING || '600', 10),

  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
};
