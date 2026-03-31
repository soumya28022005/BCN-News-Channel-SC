import slugify from 'slugify';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

const articleListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  thumbnail: true,
  publishedAt: true,
  readingTime: true,
  viewCount: true,
  isBreaking: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, username: true, avatar: true } },
} as const;

class ArticleService {
  async list({ page, limit, category }: { page: number; limit: number; category?: string }) {
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const skip = (Math.max(page, 1) - 1) * safeLimit;

    const where = {
      status: 'PUBLISHED' as const,
      ...(category ? { category: { slug: category } } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.article.findMany({
        where,
        select: articleListSelect,
        orderBy: [{ isBreaking: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: safeLimit,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        hasNext: skip + safeLimit < total,
      },
    };
  }

  async getBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
        seoMetadata: true,
      },
    });

    if (!article || article.status !== 'PUBLISHED') {
      throw new AppError('Article not found', 404);
    }

    return article;
  }

  async getTrending() {
    return prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: articleListSelect,
      orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
      take: 8,
    });
  }

  async getRelated(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true, categoryId: true },
    });

    if (!article) return [];

    return prisma.article.findMany({
      where: {
        id: { not: article.id },
        status: 'PUBLISHED',
        OR: [{ categoryId: article.categoryId }],
      },
      select: articleListSelect,
      orderBy: [{ publishedAt: 'desc' }],
      take: 6,
    });
  }

  async create(input: any, authorId: string) {
    const baseSlug = slugify(input.title, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.article.findUnique({ where: { slug }, select: { id: true } })) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    return prisma.article.create({
      data: {
        title: input.title,
        slug,
        excerpt: input.excerpt,
        content: input.content,
        thumbnail: input.thumbnail,
        thumbnailAlt: input.thumbnailAlt,
        source: input.source,
        isBreaking: Boolean(input.isBreaking),
        status: input.status ?? 'DRAFT',
        readingTime: Math.max(1, Math.ceil(String(input.content).split(/\s+/).length / 220)),
        publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
        authorId,
        categoryId: input.categoryId,
        tags: input.tagIds?.length
          ? {
              create: input.tagIds.map((tagId: string) => ({ tagId }))
            }
          : undefined,
        seoMetadata: {
          create: {
            title: input.seoTitle ?? input.title,
            description: input.seoDescription ?? input.excerpt,
            keywords: input.seoKeywords ?? [],
          },
        },
      },
      include: {
        author: { select: { id: true, name: true, username: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async trackView(slug: string, ipAddress?: string) {
    const article = await prisma.article.findUnique({ where: { slug }, select: { id: true } });
    if (!article) return;

    await prisma.$transaction([
      prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      }),
      prisma.articleView.create({
        data: {
          articleId: article.id,
          ipAddress: ipAddress ?? '0.0.0.0',
        },
      }),
    ]);
  }
}

export const articleService = new ArticleService();