import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await prisma.user.findUnique({
    where: { username: Array.isArray(username) ? username[0] : username },
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
      authorProfile: true,
      _count: {
        select: { articles: true },
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  res.json({ success: true, data: user });
});

export const getUserArticles = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const { page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const user = await prisma.user.findUnique({ where: { username: Array.isArray(username) ? username[0] : username } });
  if (!user) throw new AppError('User not found', 404);

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { authorId: user.id, status: 'PUBLISHED' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        thumbnail: true, publishedAt: true, readingTime: true,
        viewCount: true, likeCount: true,
        category: { select: { name: true, slug: true, color: true } },
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.article.count({
      where: { authorId: user.id, status: 'PUBLISHED' },
    }),
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

export const getBookmarks = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId: req.user!.id },
      include: {
        article: {
          select: {
            id: true, title: true, slug: true, excerpt: true,
            thumbnail: true, publishedAt: true, readingTime: true,
            category: { select: { name: true, slug: true, color: true } },
            author: { select: { name: true, username: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.bookmark.count({ where: { userId: req.user!.id } }),
  ]);

  res.json({
    success: true,
    data: bookmarks.map((b: { article: any; }) => b.article),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

// new add for reporter editor admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: users });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check jodi user age theke thake
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new AppError('এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে', 400);

  // পাসওয়ার্ড হ্যাশ করা হচ্ছে
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // হ্যাশ করা পাসওয়ার্ড ডাটাবেসে সেভ হবে
      username: email.split('@')[0] + Math.floor(Math.random() * 1000),
      role: role || 'JOURNALIST',
      isActive: true,
    },
    // রেসপন্সে যেন পাসওয়ার্ড না যায়, তাই নির্দিষ্ট ফিল্ডগুলো সিলেক্ট করা হলো
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    }
  });

  res.status(201).json({ success: true, data: user });
});