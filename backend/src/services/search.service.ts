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

    // ✅ Clean query
    const cleanQuery = query.trim();

    // ✅ Empty query protection
    if (!cleanQuery) {
      return {
        data: [],
        query,
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    // ✅ WHERE (Bengali + English friendly)
    const where: any = {
      status: ArticleStatus.PUBLISHED,
      OR: [
        { title: { contains: cleanQuery, mode: 'insensitive' } },
        { excerpt: { contains: cleanQuery, mode: 'insensitive' } },
        { content: { contains: cleanQuery, mode: 'insensitive' } },
        { seoKeywords: { hasSome: [cleanQuery.toLowerCase()] } },
      ],
      ...(category && { category: { slug: category } }),
      ...(tag && { tags: { some: { tag: { slug: tag } } } }),
    };

    // ✅ Smart ranking
    const orderBy: any =
      sort === 'latest'
        ? { publishedAt: 'desc' }
        : sort === 'popular'
        ? { viewCount: 'desc' }
        : [
            { viewCount: 'desc' },   // 🔥 popularity
            { publishedAt: 'desc' }, // 🔥 freshness
          ];

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
    const cleanQuery = query.trim();

    // ✅ Prevent empty / small input
    if (!cleanQuery || cleanQuery.length < 2) return [];

    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        OR: [
          { title: { startsWith: cleanQuery, mode: 'insensitive' } },
          { title: { contains: cleanQuery, mode: 'insensitive' } },
        ],
      },
      select: {
        title: true,
        slug: true,
        category: { select: { name: true } },
      },
      take: 5,
      orderBy: { viewCount: 'desc' },
    });

    return articles;
  }
}