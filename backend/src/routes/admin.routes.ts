import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAdminArticles,
  deleteUser // <-- Ei import ta add korun
} from '../controllers/admin.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// sob admin route e authenticate + isAdmin
router.use(authenticate, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/articles', getAdminArticles);

// Delete route add korun
router.delete('/users/:id', deleteUser);

export default router;