import { ArticleStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';


export async function runTrendingUpdater() {
  try {
    // সব article এর isTrending false করো
    await prisma.article.updateMany({
      where: { isTrending: true },
      data: { isTrending: false },
    });

    // গত ২৪ ঘণ্টায় সবচেয়ে বেশি view হওয়া ১০টা article trending করো
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const topArticles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: { gte: since },
      },
      orderBy: { viewCount: 'desc' },
      take: 10,
      select: { id: true },
    });

    if (topArticles.length > 0) {
      await prisma.article.updateMany({
        where: { id: { in: topArticles.map((a: { id: any; }) => a.id) } },
        data: { isTrending: true },
      });
    }

    logger.info(`Trending updater: ${topArticles.length} articles marked as trending`);
  } catch (error) {
    logger.error('Trending updater error:', error);
  }
}