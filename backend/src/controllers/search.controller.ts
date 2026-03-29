import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';
import { CacheService } from '../services/cache.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

const searchService = new SearchService();
const cacheService = new CacheService();

export const search = asyncHandler(async (req: Request, res: Response) => {
  const {
    q,
    category,
    tag,
    page = 1,
    limit = 20,
    sort = 'relevance',
  } = req.query;

  if (!q || (q as string).trim().length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400);
  }

  const cacheKey = `search:${JSON.stringify(req.query)}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  const result = await searchService.search({
    query: (q as string).trim(),
    category: category as string,
    tag: tag as string,
    page: Number(page),
    limit: Number(limit),
    sort: sort as string,
  });

  const response = { success: true, ...result };
  await cacheService.set(cacheKey, response, 120);
  res.json(response);
});

export const getSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || (q as string).length < 2) {
    return res.json({ success: true, data: [] });
  }

  const suggestions = await searchService.getSuggestions(q as string);
  res.json({ success: true, data: suggestions });
});