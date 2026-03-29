import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { asyncHandler } from '../utils/asyncHandler';

const commentService = new CommentService();

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const articleIdParam = req.params.articleId;
  const articleId = Array.isArray(articleIdParam) ? articleIdParam[0] : articleIdParam;
  const { page = 1, limit = 20 } = req.query;

  const result = await commentService.findByArticle(
    articleId,
    Number(page),
    Number(limit)
  );

  res.json({ success: true, ...result });
});

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const articleIdParam = req.params.articleId;
  const articleId = Array.isArray(articleIdParam) ? articleIdParam[0] : articleIdParam;
  const { content, parentId } = req.body;

  const comment = await commentService.create({
    content,
    articleId,
    authorId: req.user!.id,
    parentId,
  });

  res.status(201).json({
    success: true,
    message: 'Comment submitted for review',
    data: comment,
  });
});

export const approveComment = asyncHandler(async (req: Request, res: Response) => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const comment = await commentService.approve(id);

  res.json({
    success: true,
    message: 'Comment approved',
    data: comment,
  });
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const userRole = Array.isArray(req.user!.role) ? req.user!.role[0] : req.user!.role;
  await commentService.delete(id, req.user!.id, userRole);

  res.json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

export const getPendingComments = asyncHandler(async (req: Request, res: Response) => {
  const comments = await commentService.getPending();

  res.json({ success: true, data: comments });
});