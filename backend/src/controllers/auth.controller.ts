import { Request, Response } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { authService } from '../services/auth.service';

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: env.COOKIE_SAME_SITE,
  secure: env.COOKIE_SECURE,
  domain: env.COOKIE_DOMAIN || undefined,
  path: '/',
  maxAge,
});

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie(env.ACCESS_COOKIE_NAME, accessToken, cookieOptions(env.COOKIE_ACCESS_MAX_AGE_MS));
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, cookieOptions(env.COOKIE_REFRESH_MAX_AGE_MS));
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie(env.ACCESS_COOKIE_NAME, { path: '/' });
  res.clearCookie(env.REFRESH_COOKIE_NAME, { path: '/' });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
  res.status(201).json({ success: true, data: result.user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
  res.status(200).json({ success: true, data: result.user });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
  const result = await authService.refresh(refreshToken);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
  res.status(200).json({ success: true, data: result.user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user!.id);
  clearAuthCookies(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
});