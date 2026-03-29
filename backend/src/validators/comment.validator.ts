import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(2, 'Comment must be at least 2 characters')
      .max(1000, 'Comment cannot exceed 1000 characters'),
    parentId: z.string().cuid().optional(),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(2).max(1000),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>['body'];