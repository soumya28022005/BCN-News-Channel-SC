import { Router, Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { authenticate, isAdmin, isJournalist } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const analyticsService = new AnalyticsService();

router.get(
  '/dashboard',
  authenticate,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await analyticsService.getDashboardStats();
    res.json({ success: true, data: stats });
  })
);

router.get(
  '/articles/:id',
  authenticate,
  isJournalist,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const stats = await analyticsService.getArticleStats(id);
    res.json({ success: true, data: stats });
  })
);

export default router;