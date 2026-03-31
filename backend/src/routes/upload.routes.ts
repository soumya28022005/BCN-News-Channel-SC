import { Router } from 'express';
import multer from 'multer';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/media.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { strictRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// ────────────── ROUTES ──────────────

// 1. Upload Route
router.post(
  '/', // Changed from '/upload' to '/' since the base path in server.ts will be /api/v1/upload
  protect, 
  restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'JOURNALIST'), 
  strictRateLimiter, 
  upload.single('file'), 
  uploadMedia
);

// 2. Fetch all media
router.get(
  '/', 
  protect, 
  restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'JOURNALIST'), 
  getMedia
);

// 3. Delete media
router.delete(
  '/:id', 
  protect, 
  restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), 
  deleteMedia
);

// ✅ THIS IS THE CRITICAL LINE THAT ALLOWS YOU TO IMPORT IT IN SERVER.TS
export default router;