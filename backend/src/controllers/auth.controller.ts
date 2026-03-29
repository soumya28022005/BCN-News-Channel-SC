import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/database';

const authService = new AuthService();
const emailService = new EmailService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;

  const result = await authService.register({ name, email, username, password });

  // Send welcome email (non-blocking)
  emailService.sendWelcome(email, name).catch(() => {});

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 400);

  const tokens = await authService.refreshToken(refreshToken);

  res.json({
    success: true,
    data: tokens,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user!.id);

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
      id: true, name: true, email: true,
      username: true, role: true, avatar: true, bio: true,
    },
  });

  res.json({ success: true, data: user });
});