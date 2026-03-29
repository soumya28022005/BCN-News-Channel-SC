// backend/src/routes/user.routes.ts
import { Router } from 'express';
import {
  getUser,
  getUserArticles,
  getBookmarks,
  getAllUsers, // Import korun
  createUser   // Import korun
} from '../controllers/user.controller';
import { authenticate, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/:username', getUser);
router.get('/:username/articles', getUserArticles);

// Protected routes
router.use(authenticate);
router.get('/me/bookmarks', getBookmarks);

// Admin-only routes (Eii part-ti add korun)
router.use(restrictTo('ADMIN'));
router.route('/')
  .get(getAllUsers)
  .post(createUser);

export default router;