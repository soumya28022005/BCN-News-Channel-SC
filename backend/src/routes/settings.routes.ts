// File: backend/src/routes/settings.routes.ts
import { Router } from 'express';
import { getSetting, updateSetting } from '../controllers/settings.controller';

const router = Router();

// Route: /api/v1/settings/:key
router.get('/:key', getSetting);

// Route: /api/v1/settings
router.post('/', updateSetting); 

export default router;