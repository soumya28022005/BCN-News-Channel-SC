import { Router } from 'express';
import { getMe, login, logout, refresh, register } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { loginRateLimiter } from '../middlewares/rateLimiter';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', loginRateLimiter, validateRequest(registerSchema), register);
router.post('/login', loginRateLimiter, validateRequest(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;