import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/media.controller';
import { authenticate, isJournalist, isAdmin } from '../middlewares/auth.middleware';

const storage = multer.diskStorage({
  destination: '/tmp/uploads',
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

router.post('/', authenticate, isJournalist, upload.single('file'), uploadMedia);
router.get('/', authenticate, isJournalist, getMedia);
router.delete('/:id', authenticate, isAdmin, deleteMedia);

export default router;