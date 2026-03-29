/**
 * BCN – Auth Middleware
 * JWT verification and role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/database';

const authService = new AuthService();

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        name: string;
      };
    }
  }
}

// ─── AUTHENTICATE ─────────────────────────────────────────────────
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// ─── OPTIONAL AUTH ─────────────────────────────────────────────────
// Attaches user if token exists, but doesn't require it
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = authService.verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true, email: true, name: true },
      });
      if (user) req.user = user;
    }
  } catch {
    // Silently ignore auth errors for optional auth
  }
  next();
};

// ─── AUTHORIZE ROLES ───────────────────────────────────────────────
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};

// ─── ROLE SHORTCUTS ────────────────────────────────────────────────
export const isAdmin = authorize('ADMIN', 'SUPER_ADMIN');
export const isJournalist = authorize('JOURNALIST', 'EDITOR', 'ADMIN', 'SUPER_ADMIN');
export const isEditor = authorize('EDITOR', 'ADMIN', 'SUPER_ADMIN');
export const isSuperAdmin = authorize('SUPER_ADMIN');

export const restrictTo = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    // req.user asche authenticate middleware theke
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই কাজ করার অনুমতি নেই'
      });
    }
    next();
  };
};