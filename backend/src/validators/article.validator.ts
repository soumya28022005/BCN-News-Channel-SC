import { z } from 'zod';

export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
    excerpt: z.string().trim().max(500).optional(),
    content: z.string().trim().min(50, 'Content must be at least 50 characters'),
    categoryId: z.string().cuid('Invalid category ID'),
    tagIds: z.array(z.string().cuid()).optional(),
    thumbnail: z.string().url().optional().or(z.literal('')),
    thumbnailAlt: z.string().trim().max(200).optional(),
    youtubeUrl: z.string().url().optional().or(z.literal('')),
    isBreaking: z.boolean().optional().default(false),
    isFeatured: z.boolean().optional().default(false),
    seoTitle: z.string().trim().max(70).optional(),
    seoDescription: z.string().trim().max(170).optional(),
    seoKeywords: z.array(z.string().trim()).optional(),
    source: z.string().trim().max(300).optional().or(z.literal('')),
  }),
});

export const updateArticleSchema = createArticleSchema.partial();

export const scheduleArticleSchema = z.object({
  body: z.object({
    scheduledAt: z.string().datetime('Invalid date format'),
  }),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>['body'];
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>['body'];
