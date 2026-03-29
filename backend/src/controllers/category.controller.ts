import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { CacheService } from '../services/cache.service';
import { asyncHandler } from '../utils/asyncHandler';

const categoryService = new CategoryService();
const cacheService = new CacheService();

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const cacheKey = 'categories:all';
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  const categories = await categoryService.findAll();
  const response = { success: true, data: categories };

  await cacheService.set(cacheKey, response, 3600);
  res.json(response);
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const slugStr = Array.isArray(slug) ? slug[0] : slug;

  const cacheKey = `category:${slugStr}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  const category = await categoryService.findBySlug(slugStr);
  const response = { success: true, data: category };

  await cacheService.set(cacheKey, response, 3600);
  res.json(response);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body);

  await cacheService.invalidatePattern('categories:*');

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const idStr = Array.isArray(id) ? id[0] : id;
  const category = await categoryService.update(idStr, req.body);

  await cacheService.invalidatePattern('categories:*');
  await cacheService.del(`category:${category.slug}`);

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoryId = Array.isArray(id) ? id[0] : id;
  await categoryService.delete(categoryId);

  await cacheService.invalidatePattern('categories:*');

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});