/**
 * BCN – Article Service
 * Core business logic for article management
 */

import { ArticleStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import slugify from 'slugify';
import { AppError } from '../utils/AppError';


interface FindAllParams {
  page: number;
  limit: number;
  category?: string;
  tag?: string;
  author?: string;
  authorId?: string;
  // ✅ status is now OPTIONAL.
  // Public API always passes status=PUBLISHED.
  // Admin "ALL" tab passes nothing → returns DRAFT + REVIEW + PUBLISHED together.
  status?: ArticleStatus;
  search?: string;
  sort: string;
  order: 'asc' | 'desc';
  featured?: boolean;
  breaking?: boolean;
  trending?: boolean;
  excludeJournalistDrafts?: boolean;
}

const ARTICLE_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  thumbnail: true,
  thumbnailAlt: true,
  status: true,
  isBreaking: true,
  isFeatured: true,
  isTrending: true,
  publishedAt: true,
  viewCount: true,
  likeCount: true,
  commentCount: true,
  readingTime: true,
  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  author: {
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      authorProfile: { select: { title: true } },
    },
  },
  category: {
    select: { id: true, name: true, slug: true, color: true },
  },
  tags: {
    select: { tag: { select: { id: true, name: true, slug: true } } },
  },
  createdAt: true,
};

export class ArticleService {

  // ─── FIND ALL ──────────────────────────────────────────────────────
  async findAll(params: FindAllParams) {
    const {
      page, limit, category, tag, author, authorId,
      status, search, sort, order,
      featured, breaking, trending, excludeJournalistDrafts,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {
      // Only add status filter when explicitly provided.
      // "ALL" tab omits it → all statuses are returned.
      ...(status && { status }),
      ...(category && { category: { slug: category } }),
      ...(tag && { tags: { some: { tag: { slug: tag } } } }),
      ...(author && { author: { username: author } }),
      ...(authorId && { authorId }),
      ...(featured && { isFeatured: true }),
      ...(breaking && { isBreaking: true }),
      ...(trending && { isTrending: true }),
      // Admin/Editor DRAFT দেখলে journalist এর draft বাদ দাও
      ...(excludeJournalistDrafts && status === ArticleStatus.DRAFT && {
        author: { role: { not: 'JOURNALIST' } },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
{ content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { seoKeywords: { has: search.toLowerCase() } },
        ],
      }),
    };

    // Default sort by createdAt so the newest draft appears at the top right after creation
    const orderBy: Prisma.ArticleOrderByWithRelationInput =
      sort === 'views'    ? { viewCount: order }    :
      sort === 'likes'    ? { likeCount: order }    :
      sort === 'comments' ? { commentCount: order } :
      { createdAt: order };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({ where, select: ARTICLE_LIST_SELECT, orderBy, skip, take: limit }),
      prisma.article.count({ where }),
    ]);

    return {
      success: true,
      data: articles,
      pagination: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // ─── FIND BY SLUG ──────────────────────────────────────────────────
  async findBySlug(slug: string) {
    return prisma.article.findUnique({
      where: { slug, status: ArticleStatus.PUBLISHED },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true, bio: true, authorProfile: true },
        },
        category: true,
        tags: { select: { tag: true } },
        seoMeta: true,
        _count: { select: { comments: true, likes: true } },
      },
    });
  }

  // ─── FIND BY ID ────────────────────────────────────────────────────
  async findById(id: string) {
    return prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, role: true } },
        category: true,
        tags: { select: { tag: true } },
      },
    });
  }

  // ─── CREATE ────────────────────────────────────────────────────────
  async create(data: any) {
    const slug = await this.generateUniqueSlug(data.title);
    const { tagIds, author, category, ...rest } = data;

    return prisma.$transaction(async (tx: any) => {
      // 🔹 BREAKING NEWS LOGIC: Only one breaking news per category
      if (rest.isBreaking && rest.categoryId) {
        await tx.article.updateMany({
          where: { categoryId: rest.categoryId, isBreaking: true },
          data: { isBreaking: false }
        });
      }

      return tx.article.create({
        data: {
          ...rest,
          slug,
          ...(tagIds?.length > 0 && {
            tags: { create: tagIds.map((tagId: string) => ({ tagId })) },
          }),
        },
        include: {
          author: { select: { id: true, name: true } },
          category: true,
          tags: { select: { tag: true } },
        },
      });
    });
  }

  // ─── UPDATE ────────────────────────────────────────────────────────
  async update(id: string, data: any) {
    const { tagIds, author, category, ...rest } = data;

    return prisma.$transaction(async (tx: any) => {
      // 🔹 BREAKING NEWS LOGIC: Remove old breaking news in same category
      if (rest.isBreaking && rest.categoryId) {
        await tx.article.updateMany({
          where: { categoryId: rest.categoryId, id: { not: id }, isBreaking: true },
          data: { isBreaking: false }
        });
      }

      if (tagIds !== undefined) {
        await tx.article.update({ where: { id }, data: { tags: { deleteMany: {} } } });
        if (tagIds.length > 0) {
          await tx.article.update({
            where: { id },
            data: { tags: { create: tagIds.map((tagId: string) => ({ tagId })) } },
          });
        }
      }
      return tx.article.update({
        where: { id },
        data: rest,
        include: {
          author: { select: { id: true, name: true } },
          category: true,
          tags: { select: { tag: true } },
        },
      });
    });
  }

  // ─── DELETE ────────────────────────────────────────────────────────
  async delete(id: string) {
    return prisma.article.delete({ where: { id } });
  }

  // ─── UPDATE STATUS ─────────────────────────────────────────────────
  async updateStatus(id: string, status: ArticleStatus, extra?: object) {
    return prisma.article.update({ where: { id }, data: { status, ...extra } });
  }

  // ─── GET TRENDING ──────────────────────────────────────────────────
  async getTrending({ limit = 10, period = '24h' }: { limit: number; period: string }) {
    const periodHours = period === '24h' ? 24 : period === '7d' ? 168 : 720;
    const since = new Date(Date.now() - periodHours * 60 * 60 * 1000);
    return prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED, publishedAt: { gte: since } },
      select: ARTICLE_LIST_SELECT,
      orderBy: [{ viewCount: 'desc' }, { likeCount: 'desc' }],
      take: limit,
    });
  }

  // ─── GET BREAKING NEWS ─────────────────────────────────────────────
  async getBreaking() {
    return prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED, isBreaking: true },
      select: ARTICLE_LIST_SELECT,
      orderBy: { publishedAt: 'desc' },
      take: 10,
    });
  }

  // ─── GET RELATED ARTICLES ──────────────────────────────────────────
  async getRelated(slug: string, limit: number) {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true, categoryId: true, tags: { select: { tagId: true } } },
    });
    if (!article) return [];

    const tagIds = article.tags.map((t: { tagId: any }) => t.tagId);
    return prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        id: { not: article.id },
        OR: [
          { categoryId: article.categoryId },
          ...(tagIds.length > 0 ? [{ tags: { some: { tagId: { in: tagIds } } } }] : []),
        ],
      },
      select: ARTICLE_LIST_SELECT,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  // ─── TRACK VIEW ────────────────────────────────────────────────────
  async trackView(slug: string, data: {
    userId?: string; ipAddress?: string; userAgent?: string; referrer?: string;
  }) {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) return;
    await Promise.all([
      prisma.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } }),
      prisma.articleView.create({ data: { articleId: article.id, ...data } }),
    ]);
  }

  // ─── TOGGLE LIKE ───────────────────────────────────────────────────
  async toggleLike(articleId: string, userId: string) {
    const existing = await prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
    if (existing) {
      await prisma.like.delete({ where: { userId_articleId: { userId, articleId } } });
      await prisma.article.update({ where: { id: articleId }, data: { likeCount: { decrement: 1 } } });
      const a = await prisma.article.findUnique({ where: { id: articleId } });
      return { liked: false, likeCount: a?.likeCount || 0 };
    } else {
      await prisma.like.create({ data: { userId, articleId } });
      await prisma.article.update({ where: { id: articleId }, data: { likeCount: { increment: 1 } } });
      const a = await prisma.article.findUnique({ where: { id: articleId } });
      return { liked: true, likeCount: a?.likeCount || 0 };
    }
  }

  // ─── TOGGLE BOOKMARK ───────────────────────────────────────────────
  async toggleBookmark(articleId: string, userId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
    if (existing) {
      await prisma.bookmark.delete({ where: { userId_articleId: { userId, articleId } } });
      return { bookmarked: false };
    } else {
      await prisma.bookmark.create({ data: { userId, articleId } });
      return { bookmarked: true };
    }
  }

  // ─── CALCULATE READING TIME ────────────────────────────────────────
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 238;
    const cleanText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = cleanText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // ─── GENERATE UNIQUE SLUG ──────────────────────────────────────────
  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.article.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }
    return slug;
  }
}

//this is backend/src/services/article.service.ts