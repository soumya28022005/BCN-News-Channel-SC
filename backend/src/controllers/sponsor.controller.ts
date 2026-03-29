import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const prisma = new PrismaClient();

export const getSponsor = asyncHandler(async (req: Request, res: Response) => {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json({ success: true, data: sponsors });
});

export const updateSponsor = asyncHandler(async (req: Request, res: Response) => {
  const { id, title, linkUrl, imageUrl, isActive, position, duration } = req.body;

  let sponsor;
  if (id) {
    sponsor = await prisma.sponsor.update({
      where: { id },
      data: { title, linkUrl, imageUrl, isActive, position, duration: parseInt(duration) || 5 }
    });
  } else {
    sponsor = await prisma.sponsor.create({
      data: { title, linkUrl, imageUrl, isActive, position, duration: parseInt(duration) || 5 }
    });
  }
  
  res.status(200).json({ success: true, data: sponsor });
});

export const deleteSponsor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.sponsor.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Ad deleted successfully' });
});