import { Router } from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
} from '../controllers/newsletter.controller';
import { authenticate, isAdmin, optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/subscribe', optionalAuth, subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/subscribers', authenticate, isAdmin, getSubscribers);

export default router;