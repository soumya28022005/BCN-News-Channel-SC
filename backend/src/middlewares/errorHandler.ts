import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export function errorHandler(error: any, req: Request, res: Response, _next: NextFunction) {
  let statusCode = error?.statusCode || 500;
  let message = error?.message || 'Internal server error';

  if (error instanceof ZodError) {
    statusCode = 422;
    message = error.issues.map((issue) => issue.message).join(', ');
  }

  if (error?.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate ${error.meta?.target?.join(', ') || 'record'}`;
  }

  if (error?.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  if (statusCode >= 500) {
    logger.error({
      message: error?.message,
      stack: error?.stack,
      path: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(config.NODE_ENV !== 'production' && error?.stack ? { stack: error.stack } : {}),
  });
}