import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z.coerce.boolean().optional(),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  ACCESS_COOKIE_NAME: z.string().default('bcn_access'),
  REFRESH_COOKIE_NAME: z.string().default('bcn_refresh'),
  ACCESS_COOKIE_MAX_AGE_MS: z.coerce.number().default(15 * 60 * 1000),
  REFRESH_COOKIE_MAX_AGE_MS: z.coerce.number().default(7 * 24 * 60 * 60 * 1000),
  SITE_URL: z.string().url().default('http://localhost:3000'),
  SITE_NAME: z.string().default('BCN - The Bengal Chronicle Network'),
  CACHE_TTL_ARTICLES: z.coerce.number().default(300),
  CACHE_TTL_CATEGORIES: z.coerce.number().default(3600),
  CACHE_TTL_TRENDING: z.coerce.number().default(600),
  DEFAULT_PAGE_SIZE: z.coerce.number().default(20),
  MAX_PAGE_SIZE: z.coerce.number().default(50),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('noreply@bengalchronicle.com'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed');
}

export const env = parsed.data;

export const config = {
  ...env,
  IS_PROD: env.NODE_ENV === 'production',
  CORS_ORIGINS: env.CORS_ORIGINS.split(',').map((item) => item.trim()).filter(Boolean),
  COOKIE_SECURE: env.COOKIE_SECURE ?? env.NODE_ENV === 'production',
} as const;