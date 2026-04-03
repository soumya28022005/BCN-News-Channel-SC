// backend/src/services/ad.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Utility for Fisher-Yates Shuffle (Fair Rotation)
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const getActiveAds = async () => {
  const ads = await prisma.advertisement.findMany({
    where: { isActive: true },
    select: { id: true, title: true, imageUrl: true, linkUrl: true, placement: true, weight: true }
  });

  // Group by placement and shuffle for rotation
  const groupedAds = {
    TOP: shuffleArray(ads.filter(a => a.placement === 'TOP')),
    BOTTOM: shuffleArray(ads.filter(a => a.placement === 'BOTTOM')),
    SIDEBAR: shuffleArray(ads.filter(a => a.placement === 'SIDEBAR')),
    IN_CONTENT: shuffleArray(ads.filter(a => a.placement === 'IN_CONTENT')),
  };

  return groupedAds;
};