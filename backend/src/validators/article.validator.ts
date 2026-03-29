import { z } from 'zod';

export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    excerpt: z.string().max(500).optional(),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    categoryId: z.string().cuid('Invalid category ID'),
    tagIds: z.array(z.string().cuid()).optional(),
    thumbnail: z.string().url().optional(),
    thumbnailAlt: z.string().max(200).optional(),
    isBreaking: z.boolean().optional().default(false),
    isFeatured: z.boolean().optional().default(false),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(170).optional(),
    seoKeywords: z.array(z.string()).optional(),
    // 🔹 ADD THIS LINE TO ALLOW SOURCE LINKS
    source: z.string().optional(), 
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