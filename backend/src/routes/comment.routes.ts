import { Router } from 'express';
import {
  getComments,
  createComment,
  approveComment,
  deleteComment,
  getPendingComments,
} from '../controllers/comment.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/article/:articleId', getComments);
router.post('/article/:articleId', authenticate, createComment);
router.patch('/:id/approve', authenticate, isAdmin, approveComment);
router.delete('/:id', authenticate, deleteComment);
router.get('/pending', authenticate, isAdmin, getPendingComments);

export default router;