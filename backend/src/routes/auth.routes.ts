import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { strictRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', strictRateLimiter, register);
router.post('/login', strictRateLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);

export default router;