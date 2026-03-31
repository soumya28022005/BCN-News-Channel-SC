import { Router } from 'express';
import {
  createArticle,
  getArticleBySlug,
  getArticles,
  getRelatedArticles,
  getTrendingArticles,
} from '../controllers/article.controller';
import { authenticate, restrictTo } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { articleCreateSchema } from '../validators/article.validator';

const router = Router();

router.get('/', getArticles);
router.get('/trending', getTrendingArticles);
router.get('/:slug/related', getRelatedArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', authenticate, restrictTo('ADMIN', 'EDITOR', 'JOURNALIST'), validateRequest(articleCreateSchema), createArticle);

export default router;