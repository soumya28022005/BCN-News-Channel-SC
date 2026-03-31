import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60),
    email: z.string().trim().email(),
    username: z.string().trim().min(3).max(30).regex(/^[a-z0-9-]+$/),
    password: z.string().min(8).max(100).regex(/[A-Z]/).regex(/[0-9]/),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
});