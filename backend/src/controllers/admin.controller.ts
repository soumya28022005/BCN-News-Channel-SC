import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../config/database';

const analyticsService = new AnalyticsService();

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await analyticsService.getDashboardStats();
  res.json({ success: true, data: stats });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { username: { contains: search as string, mode: 'insensitive' } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, username: true,
        role: true, avatar: true, isActive: true,
        isVerified: true, createdAt: true, lastLogin: true,
        _count: { select: { articles: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await prisma.user.update({
    where: { id: id as string },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  res.json({
    success: true,
    message: 'User role updated',
    data: user,
  });
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id: id as string  } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const updated = await prisma.user.update({
     where: { id: id as string },
    data: { isActive: !user.isActive },
    select: { id: true, name: true, isActive: true },
  });

  res.json({
    success: true,
    message: `User ${updated.isActive ? 'activated' : 'suspended'}`,
    data: updated,
  });
});

export const getAdminArticles = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {
    ...(status && { status }),
    ...(search && {
      title: { contains: search as string, mode: 'insensitive' },
    }),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      select: {
        id: true, title: true, slug: true, status: true,
        isBreaking: true, isFeatured: true, publishedAt: true,
        viewCount: true, likeCount: true, commentCount: true,
        seoScore: true, createdAt: true,
        author: { select: { name: true, username: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.article.count({ where }),
  ]);

  res.json({
    success: true,
    data: articles,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});