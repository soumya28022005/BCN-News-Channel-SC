import { prisma } from '../config/database';


export class AnalyticsService {

  async getDashboardStats() {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalArticles,
      publishedArticles,
      totalUsers,
      totalViews,
      todayArticles,
      weeklyViews,
      topArticles,
      categoryStats,
      avgSeoScore,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.article.aggregate({ _sum: { viewCount: true } }),
      prisma.article.count({ where: { createdAt: { gte: today } } }),
      prisma.articleView.count({ where: { createdAt: { gte: thisWeek } } }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: {
          id: true, title: true, slug: true,
          viewCount: true, likeCount: true,
          category: { select: { name: true } },
        },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { articles: true } },
        },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.article.aggregate({
        _avg: { seoScore: true },
        where: { status: 'PUBLISHED' },
      }),
    ]);

    return {
      totalArticles,
      publishedArticles,
      totalUsers,
      totalViews: Number(totalViews._sum.viewCount || 0),
      todayArticles,
      weeklyViews,
      avgSeoScore: Math.round(avgSeoScore._avg.seoScore || 0),
      topArticles,
      categoryStats: categoryStats.map((c: { name: any; slug: any; color: any; _count: { articles: any; }; }) => ({
        name: c.name,
        slug: c.slug,
        color: c.color,
        articleCount: c._count.articles,
      })),
    };
  }

  async getArticleStats(articleId: string) {
    const views = await prisma.articleView.groupBy({
      by: ['createdAt'],
      where: { articleId },
      _count: true,
      orderBy: { createdAt: 'asc' },
    });

    const deviceStats = await prisma.articleView.groupBy({
      by: ['device'],
      where: { articleId },
      _count: true,
    });

    const referrerStats = await prisma.articleView.groupBy({
      by: ['referrer'],
      where: { articleId, referrer: { not: null } },
      _count: true,
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    });

    return { views, deviceStats, referrerStats };
  }
}