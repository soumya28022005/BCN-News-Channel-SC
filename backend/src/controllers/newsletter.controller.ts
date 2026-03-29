import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { EmailService } from '../services/email.service';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/database';

const emailService = new EmailService();

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email, categories } = req.body;

  if (!email) throw new AppError('Email is required', 400);

  const existing = await prisma.newsletter.findUnique({ where: { email } });

  if (existing) {
    if (existing.isActive) {
      return res.json({
        success: true,
        message: 'You are already subscribed!',
      });
    }
    await prisma.newsletter.update({
      where: { email },
      data: { isActive: true, categories: categories || [] },
    });
  } else {
    await prisma.newsletter.create({
      data: {
        email,
        categories: categories || [],
        userId: req.user?.id,
      },
    });
  }

  emailService.sendNewsletterConfirmation(email).catch(() => {});

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to BCN newsletter!',
  });
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) throw new AppError('Email is required', 400);

  await prisma.newsletter.updateMany({
    where: { email },
    data: { isActive: false },
  });

  res.json({
    success: true,
    message: 'Successfully unsubscribed',
  });
});

export const getSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [subscribers, total] = await Promise.all([
    prisma.newsletter.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.newsletter.count({ where: { isActive: true } }),
  ]);

  res.json({
    success: true,
    data: subscribers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});