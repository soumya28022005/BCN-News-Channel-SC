import { ArticleStatus } from '@prisma/client';
import { prisma } from '../config/database';


export class SearchService {

  async search(params: {
    query: string;
    category?: string;
    tag?: string;
    page: number;
    limit: number;
    sort?: string;
  }) {
    const { query, category, tag, page, limit, sort = 'relevance' } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      status: ArticleStatus.PUBLISHED,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { seoKeywords: { has: query.toLowerCase() } },
      ],
      ...(category && { category: { slug: category } }),
      ...(tag && { tags: { some: { tag: { slug: tag } } } }),
    };

    const orderBy: any =
      sort === 'latest' ? { publishedAt: 'desc' } :
      sort === 'popular' ? { viewCount: 'desc' } :
      { publishedAt: 'desc' };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
          publishedAt: true,
          readingTime: true,
          viewCount: true,
          author: {
            select: { name: true, username: true, avatar: true },
          },
          category: {
            select: { name: true, slug: true, color: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      data: articles,
      query,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSuggestions(query: string) {
    if (query.length < 2) return [];

    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        title: { contains: query, mode: 'insensitive' },
      },
      select: { title: true, slug: true, category: { select: { name: true } } },
      take: 5,
      orderBy: { viewCount: 'desc' },
    });

    return articles;
  }
}