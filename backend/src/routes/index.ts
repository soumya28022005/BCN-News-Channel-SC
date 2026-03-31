import { Router } from 'express';
import articleRoutes from './article.routes';
import authRoutes from './auth.routes';

export const router = Router();
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);