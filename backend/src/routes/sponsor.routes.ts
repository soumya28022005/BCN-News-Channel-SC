import express from 'express';
import { getSponsor, updateSponsor, deleteSponsor } from '../controllers/sponsor.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getSponsor);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateSponsor);
// 🔹 ADDED: Delete route for specific ads
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteSponsor);

export default router;