import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { prisma } from '../config/database';
import slugify from 'slugify';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const tags = await prisma.tag.findMany({
    orderBy: { usageCount: 'desc' },
    take: 50,
  });
  res.json({ success: true, data: tags });
}));

router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return res.status(404).json({ success: false, message: 'Tag not found' });
  res.json({ success: true, data: tag });
}));

router.post('/', authenticate, isAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { name, description, color } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const tag = await prisma.tag.create({
    data: { name, slug, description, color },
  });
  res.status(201).json({ success: true, data: tag });
}));

router.delete('/:id', authenticate, isAdmin, asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await prisma.tag.delete({ where: { id } });
  res.json({ success: true, message: 'Tag deleted' });
}));

export default router;