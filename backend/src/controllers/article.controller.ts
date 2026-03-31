/**
 * BCN – Article Controller
 * Handles all article-related HTTP requests
 */

import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/article.service';
import { SeoService } from '../services/seo.service';
import { CacheService } from '../services/cache.service';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { ArticleStatus } from '@prisma/client';
import { sanitizeArticleInput } from '../utils/sanitize';


const articleService = new ArticleService();

const seoService = new SeoService();
const cacheService = new CacheService();

// ─── GET ALL ARTICLES ──────────────────────────────────────────────
export const getArticles = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    category,
    tag,
    author,   // username — public author pages use this
    authorId, // CUID   — admin dashboard uses this
    status,
    search,
    sort = 'createdAt',
    order = 'desc',
    featured,
    breaking,
    trending,
  } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  let queryStatus = status as ArticleStatus | undefined;

  // ── লজিক ১: অনুমোদিত role ছাড়া যেকোনো visitor শুধু PUBLISHED দেখবে ──
  if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'JOURNALIST'].includes(req.user.role)) {
    queryStatus = ArticleStatus.PUBLISHED;
  }

  // ── লজিক ২: JOURNALIST সবসময় শুধু নিজের articles দেখবে ──────────
  const queryAuthorId: string | undefined =
    req.user?.role === 'JOURNALIST'
      ? req.user.id
      : (authorId as string) || undefined;

  // ── লজিক ৩: Admin/Editor DRAFT দেখতে চাইলে শুধু নিজের DRAFT দেখবে ──
  // Reporter এর DRAFT Admin/Editor দেখবে না।
  // যদি Admin/Editor status=DRAFT request করে এবং authorId না দেয়,
  // তাহলে শুধু নিজের DRAFT দেখাবে।
  if (
    req.user &&
    ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user.role) &&
    queryStatus === ArticleStatus.DRAFT &&
    !queryAuthorId
  ) {
    // Admin/Editor এর নিজের draft — কিন্তু reporter এর draft নয়
    // তাই JOURNALIST role এর articles বাদ দিতে হবে
    // সহজ সমাধান: status DRAFT এ authorRole filter — service এ pass করব না,
    // বরং frontend এ authorId দিলে সেটা দেখাবে
    // এখানে কিছু করার নেই — service এ excludeRole যোগ করা দরকার
  }

  // ── লজিক ৪: `author` শুধু public username filter (author page) ───
  const queryAuthorUsername: string | undefined =
    req.user?.role !== 'JOURNALIST' ? (author as string) || undefined : undefined;

  // ── Cache: JOURNALIST-এর জন্য cache skip করা হচ্ছে ────────────────
  // কারণ: reporter নতুন article তৈরি করলে সঙ্গে সঙ্গে list-এ দেখাতে হবে।
  // Cache-এ 5 মিনিট পুরনো data থাকলে নতুন DRAFT/REVIEW দেখা যাবে না।
  const isJournalist = req.user?.role === 'JOURNALIST';

  if (!isJournalist) {
    const cacheKey = `articles:${JSON.stringify({ ...req.query, queryStatus })}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return res.json(cached);
  }

  const result = await articleService.findAll({
   page: pageNum,
   limit: limitNum,
    category: category as string,
    tag: tag as string,
    author: queryAuthorUsername,
    authorId: queryAuthorId,
    excludeJournalistDrafts: ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user?.role || ''),
    status: queryStatus,
    search: search as string,
    sort: sort as string,
    order: order as 'asc' | 'desc',
    featured: featured === 'true',
    breaking: breaking === 'true',
    trending: trending === 'true',
  });

  // Journalist-এর response cache করা হচ্ছে না (সবসময় fresh data দরকার)
  if (!isJournalist) {
    const cacheKey = `articles:${JSON.stringify({ ...req.query, queryStatus })}`;
    await cacheService.set(cacheKey, result, 300);
  }

  return res.json(result);
});

// ─── GET SINGLE ARTICLE ────────────────────────────────────────────
export const getArticle = asyncHandler(async (req: Request, res: Response) => {
  const slugParam = req.params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const cacheKey = `article:${slug}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    articleService.trackView(slug, {
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer,
    }).catch(() => {});
    return res.json(cached);
  }

  const article = await articleService.findBySlug(slug);
  if (!article) throw new AppError('Article not found', 404);

  await cacheService.set(cacheKey, article, 300);

  articleService.trackView(slug, {
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    referrer: req.headers.referer,
  }).catch(() => {});

  return res.json(article);
});

// ─── CREATE ARTICLE ────────────────────────────────────────────────
export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const authorId_create = req.user!.id;
  const userRole = req.user!.role;

  // ── Status enforcement (server-side, cannot be overridden by frontend) ──
  // JOURNALIST: যাই পাঠাক, status হবে REVIEW বা DRAFT (frontend থেকে আসা value মানা হবে
  //             শুধু যদি DRAFT হয় — REVIEW বা PUBLISHED বা অন্য কিছু হলে REVIEW দেওয়া হবে)।
  // ADMIN/EDITOR: frontend যা পাঠায় সেটাই থাকবে।
  let finalStatus = req.body.status;

  if (userRole === 'JOURNALIST') {
    // Reporter শুধু DRAFT বা REVIEW save করতে পারবে
    // অন্য কোনো status frontend থেকে এলেও সেটা reject হবে
    const allowedForReporter = ['DRAFT', 'REVIEW'];
    if (!allowedForReporter.includes(finalStatus)) {
      finalStatus = 'REVIEW'; // default: সম্পাদকের কাছে পাঠানো
    }
  }

  const sanitizedBody = sanitizeArticleInput(req.body);

 const seoData = await seoService.generateSeoMetadata({
  title: req.body.title,
  content: req.body.content,
  excerpt: req.body.excerpt,
  category: req.body.categoryId,
});

const readingTime = articleService.calculateReadingTime(req.body.content);

 const article = await articleService.create({
  ...req.body,
  status: finalStatus,
  authorId: authorId_create,   
    readingTime,
    seoTitle: req.body.seoTitle || seoData.title,
    seoDescription: req.body.seoDescription || seoData.description,
    seoKeywords: req.body.seoKeywords || seoData.keywords,
    articleSchema: seoData.jsonLd,
    seoScore: seoData.seoScore,
    readabilityScore: seoData.readabilityScore,
  });

  await cacheService.invalidatePattern('articles:*');

  res.status(201).json({
    success: true,
    message: 'Article created successfully',
    data: article,
    seoInsights: {
      score: seoData.seoScore,
      readability: seoData.readabilityScore,
      keywordDensity: seoData.keywordDensity,
      suggestions: seoData.suggestions,
    },
  });
});

// ─── UPDATE ARTICLE ────────────────────────────────────────────────
export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const idStr = Array.isArray(id) ? id[0] : id;

  const existing = await articleService.findById(idStr);
  if (!existing) throw new AppError('Article not found', 404);

  const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user!.role);
  const isAuthor = existing.authorId === req.user!.id;

  if (!isAdminOrEditor && !isAuthor) {
    throw new AppError('আপনি শুধুমাত্র নিজের লেখা নিউজ এডিট করতে পারবেন', 403);
  }

  // JOURNALIST নিজের article edit করলে status REVIEW বা DRAFT-এর বাইরে যেতে পারবে না
  let updatedStatus = req.body.status;
  if (req.user!.role === 'JOURNALIST') {
    const allowedForReporter = ['DRAFT', 'REVIEW'];
    if (updatedStatus && !allowedForReporter.includes(updatedStatus)) {
      updatedStatus = existing.status; // আগের status বজায় থাকবে
    }
  }

  let seoData = null;
  if (req.body.content || req.body.title) {
    seoData = await seoService.generateSeoMetadata({
      title: req.body.title || existing.title,
      content: req.body.content || existing.content,
      excerpt: req.body.excerpt || existing.excerpt,
    });
  }

  const finalEditorId = req.user!.id !== existing.authorId ? req.user!.id : null;

  const updated = await articleService.update(idStr, {
    ...req.body,
    ...(updatedStatus && { status: updatedStatus }),
    lastEditorId: finalEditorId,
    ...(seoData && !req.body.seoTitle && { seoTitle: seoData.title }),
    ...(seoData && !req.body.seoDescription && { seoDescription: seoData.description }),
    ...(seoData && { seoScore: seoData.seoScore }),
    ...(req.body.content && { readingTime: articleService.calculateReadingTime(req.body.content) }),
  });

  await cacheService.del(`article:${existing.slug}`);
  await cacheService.invalidatePattern('articles:*');

  res.json({
    success: true,
    message: 'Article updated successfully',
    data: updated,
  });
});

// ─── DELETE ARTICLE ────────────────────────────────────────────────
export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const idStr = Array.isArray(id) ? id[0] : id;

  const existing = await articleService.findById(idStr);
  if (!existing) throw new AppError('Article not found', 404);

  const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user!.role);
  const isAuthor = existing.authorId === req.user!.id;

  if (!isAdminOrEditor && !isAuthor) {
    throw new AppError('আপনি শুধুমাত্র নিজের লেখা নিউজ ডিলিট করতে পারবেন', 403);
  }

  await articleService.delete(idStr);
  await cacheService.del(`article:${existing.slug}`);
  await cacheService.invalidatePattern('articles:*');

  res.json({ success: true, message: 'Article deleted successfully' });
});

// ─── PUBLISH ARTICLE ───────────────────────────────────────────────
export const publishArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const idStr = Array.isArray(id) ? id[0] : id;

  // Only ADMIN and EDITOR can publish
  const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user!.role);
  if (!isAdminOrEditor) {
    throw new AppError('শুধুমাত্র সম্পাদক বা অ্যাডমিন নিউজ প্রকাশ করতে পারবেন', 403);
  }

  const article = await articleService.updateStatus(idStr, ArticleStatus.PUBLISHED, {
    publishedAt: new Date(),
  });

  await cacheService.del(`article:${article.slug}`);
  await cacheService.invalidatePattern('articles:*');

  res.json({
    success: true,
    message: 'Article published successfully',
    data: article,
  });
});

// ─── SCHEDULE ARTICLE ──────────────────────────────────────────────
export const scheduleArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const idStr = Array.isArray(id) ? id[0] : id;
  const { scheduledAt } = req.body;

  if (!scheduledAt) throw new AppError('Scheduled date is required', 400);
  if (new Date(scheduledAt) <= new Date()) {
    throw new AppError('Scheduled date must be in the future', 400);
  }

  const article = await articleService.updateStatus(idStr, ArticleStatus.SCHEDULED, {
    scheduledAt: new Date(scheduledAt),
  });

  res.json({
    success: true,
    message: `Article scheduled for ${new Date(scheduledAt).toISOString()}`,
    data: article,
  });
});

// ─── GET TRENDING ──────────────────────────────────────────────────
export const getTrending = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10, period = '24h' } = req.query;

  const cacheKey = `trending:${limit}:${period}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  const articles = await articleService.getTrending({
    limit: Number(limit),
    period: period as string,
  });

  await cacheService.set(cacheKey, articles, 600);
  res.json(articles);
});

// ─── GET BREAKING NEWS ─────────────────────────────────────────────
export const getBreaking = asyncHandler(async (req: Request, res: Response) => {
  const cacheKey = 'breaking:news';
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  const articles = await articleService.getBreaking();
  await cacheService.set(cacheKey, articles, 120);
  res.json(articles);
});

// ─── GET RELATED ARTICLES ──────────────────────────────────────────
export const getRelated = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { limit = 5 } = req.query;

  const slugStr = Array.isArray(slug) ? slug[0] : slug;
  const cacheKey = `related:${slugStr}:${limit}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  const articles = await articleService.getRelated(slugStr, Number(limit));
  await cacheService.set(cacheKey, articles, 3600);
  res.json(articles);
});

// ─── LIKE ARTICLE ──────────────────────────────────────────────────
export const likeArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await articleService.toggleLike(id as string, req.user!.id);
  res.json({ success: true, liked: result.liked, likeCount: result.likeCount });
});

// ─── BOOKMARK ARTICLE ──────────────────────────────────────────────
export const bookmarkArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await articleService.toggleBookmark(id as string, req.user!.id);
  res.json({ success: true, bookmarked: result.bookmarked });
});

// ─── GET SEO ANALYSIS ──────────────────────────────────────────────
export const getArticleSeoAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await articleService.findById(id as string);
  if (!article) throw new AppError('Article not found', 404);

  const analysis = await seoService.analyzeArticle(article);
  res.json({ success: true, data: analysis });
});
// ─── GET ARTICLE BY ID (for admin edit page) ───────────────────────
export const getArticleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const idStr = Array.isArray(id) ? id[0] : id;
  const article = await articleService.findById(idStr);
  if (!article) throw new AppError('Article not found', 404);
  return res.json({ success: true, article });
});

// this is backend/src/controllers/article.controller.ts 