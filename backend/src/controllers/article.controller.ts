import { Request, Response } from 'express';
import { env } from '../config/env';
import { articleService } from '../services/article.service';
import { cacheService } from '../services/cache.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getArticles = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? env.DEFAULT_PAGE_SIZE);
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const cacheKey = `articles:list:${page}:${limit}:${category ?? 'all'}`;

  const cached = await cacheService.get(cacheKey);
  if (cached) {
    return res.status(200).json({ success: true, data: cached, cached: true });
  }

  const result = await articleService.list({ page, limit, category });
  await cacheService.set(cacheKey, result, env.CACHE_TTL_HOME);
  res.status(200).json({ success: true, data: result });
});

export const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const cacheKey = `article:${slug}`;

  const cached = await cacheService.get(cacheKey);
  if (cached) {
    void articleService.trackView(slug, req.ip);
    return res.status(200).json({ success: true, data: cached, cached: true });
  }

  const article = await articleService.getBySlug(slug);
  await cacheService.set(cacheKey, article, env.CACHE_TTL_ARTICLE);
  void articleService.trackView(slug, req.ip);
  res.status(200).json({ success: true, data: article });
});

export const getTrendingArticles = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = 'articles:trending';
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.status(200).json({ success: true, data: cached, cached: true });

  const result = await articleService.getTrending();
  await cacheService.set(cacheKey, result, env.CACHE_TTL_HOME);
  res.status(200).json({ success: true, data: result });
});

export const getRelatedArticles = asyncHandler(async (req: Request, res: Response) => {
  const result = await articleService.getRelated(req.params.slug);
  res.status(200).json({ success: true, data: result });
});

export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const article = await articleService.create(req.body, req.user!.id);
  await cacheService.invalidateByPrefix('articles:list:');
  await cacheService.del(`article:${article.slug}`);
  res.status(201).json({ success: true, data: article });
});