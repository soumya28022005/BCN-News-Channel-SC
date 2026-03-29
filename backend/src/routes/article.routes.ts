/**
 * BCN – Article Routes
 */
import { Router } from 'express';
import {
  getArticles, getArticle, getArticleById, createArticle, updateArticle,
  deleteArticle, publishArticle, scheduleArticle, getTrending,
  getBreaking, getRelated, likeArticle, bookmarkArticle,
  getArticleSeoAnalysis,
} from '../controllers/article.controller';

// 🔹 restrictTo ইম্পোর্ট করুন
import { authenticate, optionalAuth, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────
router.get('/', optionalAuth, getArticles);
router.get('/trending', getTrending);
router.get('/breaking', getBreaking);
router.get('/id/:id', optionalAuth, getArticleById);
router.get('/:slug', optionalAuth, getArticle);
router.get('/:slug/related', getRelated);

// ─── AUTHENTICATED ROUTES ──────────────────────────────────────────
router.post('/:id/like', authenticate, likeArticle);
router.post('/:id/bookmark', authenticate, bookmarkArticle);

// ─── CREATE, UPDATE, DELETE (Journalist, Editor, Admin সবাই পারবে) ───
router.post('/', authenticate, restrictTo('JOURNALIST', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'), createArticle);
router.put('/:id', authenticate, restrictTo('JOURNALIST', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'), updateArticle);
router.patch('/:id', authenticate, restrictTo('JOURNALIST', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'), updateArticle);
router.delete('/:id', authenticate, restrictTo('JOURNALIST', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'), deleteArticle);
router.get('/:id/seo-analysis', authenticate, restrictTo('JOURNALIST', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'), getArticleSeoAnalysis);

// ─── PUBLISH & SCHEDULE (শুধু Editor এবং Admin পারবে) ─────
router.patch('/:id/publish', authenticate, restrictTo('EDITOR', 'ADMIN', 'SUPER_ADMIN'), publishArticle);
router.patch('/:id/schedule', authenticate, restrictTo('EDITOR', 'ADMIN', 'SUPER_ADMIN'), scheduleArticle);

export default router;