import { ArticleStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';


export async function runSchedulePublisher() {
  try {
    const now = new Date();

    const scheduledArticles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.SCHEDULED,
        scheduledAt: { lte: now },
      },
    });

    if (scheduledArticles.length === 0) return;

    for (const article of scheduledArticles) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          status: ArticleStatus.PUBLISHED,
          publishedAt: now,
          scheduledAt: null,
        },
      });
      logger.info(`✅ Auto-published: "${article.title}"`);
    }

    logger.info(`Scheduled publisher: ${scheduledArticles.length} articles published`);
  } catch (error) {
    logger.error('Scheduled publisher error:', error);
  }
}