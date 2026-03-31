import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

function getToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return req.cookies?.[config.ACCESS_COOKIE_NAME] ?? null;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (!token) throw new AppError('Authentication required', 401);

    const decoded = authService.verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) throw new AppError('User account is not available', 401);

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (!token) return next();

    const decoded = authService.verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (user?.isActive) {
      req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    }
  } catch {
    // ignore optional auth failures
  }
  next();
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    if (!roles.includes(req.user.role)) return next(new AppError('Insufficient permissions', 403));
    return next();
  };
}

export const isAdmin = authorize('ADMIN', 'SUPER_ADMIN');
export const isEditor = authorize('EDITOR', 'ADMIN', 'SUPER_ADMIN');
export const isJournalist = authorize('JOURNALIST', 'EDITOR', 'ADMIN', 'SUPER_ADMIN');