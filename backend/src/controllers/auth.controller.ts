import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/database';
import { config } from '../config/env';

const authService = new AuthService();
const emailService = new EmailService();

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: config.COOKIE_SECURE,
    sameSite: config.COOKIE_SAME_SITE,
    domain: config.COOKIE_DOMAIN,
    path: '/',
  } as const;
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(config.ACCESS_COOKIE_NAME, accessToken, {
    ...baseCookieOptions(),
    maxAge: config.ACCESS_COOKIE_MAX_AGE_MS,
  });

  res.cookie(config.REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    maxAge: config.REFRESH_COOKIE_MAX_AGE_MS,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie(config.ACCESS_COOKIE_NAME, {
    ...baseCookieOptions(),
    maxAge: 0,
  });

  res.clearCookie(config.REFRESH_COOKIE_NAME, {
    ...baseCookieOptions(),
    maxAge: 0,
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;

  const result = await authService.register({ name, email, username, password });

  setAuthCookies(res, result.accessToken, result.refreshToken);

  emailService.sendWelcome(email, name).catch(() => {});

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: result.user,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
    },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token =
    req.cookies?.[config.REFRESH_COOKIE_NAME] || req.body?.refreshToken;

  if (!token) throw new AppError('Refresh token required', 400);

  const tokens = await authService.refreshToken(token);

  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    success: true,
    message: 'Session refreshed',
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.id) {
    await authService.logout(req.user.id);
  }

  clearAuthCookies(res);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      avatar: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      authorProfile: true,
    },
  });

  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, bio, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, bio, avatar },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      avatar: true,
      bio: true,
    },
  });

  res.json({ success: true, data: user });
});
