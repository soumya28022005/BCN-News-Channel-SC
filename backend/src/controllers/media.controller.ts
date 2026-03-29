import { Request, Response } from 'express';
import { MediaService } from '../services/media.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

const mediaService = new MediaService();

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const media = await mediaService.upload(req.file, req.user!.id);

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    data: media,
  });
});

export const getMedia = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await mediaService.findAll(Number(page), Number(limit));
  res.json({ success: true, ...result });
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const mediaId = Array.isArray(id) ? id[0] : id;
  await mediaService.delete(mediaId);

  res.json({
    success: true,
    message: 'Media deleted successfully',
  });
});