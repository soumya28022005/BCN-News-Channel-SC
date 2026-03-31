import { z } from 'zod';

const boolFromUnknown = z.preprocess((value) => value === 'true' ? true : value === 'false' ? false : value, z.boolean().optional());

export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5).max(200),
    excerpt: z.string().trim().max(500).optional().or(z.literal('')),
    content: z.string().trim().min(50),
    categoryId: z.string().cuid(),
    tagIds: z.array(z.string().cuid()).optional().default([]),
    thumbnail: z.string().trim().url().optional().or(z.literal('')),
    thumbnailAlt: z.string().trim().max(200).optional().or(z.literal('')),
    youtubeUrl: z.string().trim().url().optional().or(z.literal('')),
    isBreaking: boolFromUnknown.default(false),
    isFeatured: boolFromUnknown.default(false),
    seoTitle: z.string().trim().max(70).optional().or(z.literal('')),
    seoDescription: z.string().trim().max(170).optional().or(z.literal('')),
    seoKeywords: z.array(z.string().trim().min(1)).optional().default([]),
    source: z.string().trim().max(300).optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  }),
});

export const updateArticleSchema = createArticleSchema.partial();

export const articleListQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    category: z.string().optional(),
    tag: z.string().optional(),
    author: z.string().optional(),
    authorId: z.string().optional(),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
    search: z.string().optional(),
    sort: z.enum(['createdAt', 'publishedAt', 'views', 'likes', 'comments']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
    featured: z.string().optional(),
    breaking: z.string().optional(),
    trending: z.string().optional(),
  }),
});