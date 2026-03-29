import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../config/database';
import type { Express } from 'express';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';


cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export class MediaService {

  async upload(file: Express.Multer.File, uploadedBy: string) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'bcn',
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    return prisma.media.create({
      data: {
        filename: result.public_id,
        originalName: file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        type: 'IMAGE',
        size: file.size,
        width: result.width,
        height: result.height,
        uploadedBy,
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.media.count(),
    ]);

    return {
      data: media,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async delete(id: string) {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new AppError('Media not found', 404);

    if (media.publicId) {
      await cloudinary.uploader.destroy(media.publicId);
    }

    return prisma.media.delete({ where: { id } });
  }
}