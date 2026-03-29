import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';


export class CommentService {

  async findByArticle(articleId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          articleId,
          parentId: null,
          isApproved: true,
        },
        include: {
          author: {
            select: { id: true, name: true, username: true, avatar: true },
          },
          replies: {
            where: { isApproved: true },
            include: {
              author: {
                select: { id: true, name: true, username: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: { articleId, parentId: null, isApproved: true },
      }),
    ]);

    return {
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: {
    content: string;
    articleId: string;
    authorId: string;
    parentId?: string;
  }) {
    const article = await prisma.article.findUnique({
      where: { id: data.articleId },
    });
    if (!article) throw new AppError('Article not found', 404);

    if (data.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) throw new AppError('Parent comment not found', 404);
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        articleId: data.articleId,
        authorId: data.authorId,
        parentId: data.parentId,
        isApproved: false,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });

    await prisma.article.update({
      where: { id: data.articleId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  async approve(id: string) {
    return prisma.comment.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async delete(id: string, userId: string, userRole: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new AppError('Comment not found', 404);

    const isOwner = comment.authorId === userId;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

    if (!isOwner && !isAdmin) {
      throw new AppError('Unauthorized to delete this comment', 403);
    }

    await prisma.comment.delete({ where: { id } });

    await prisma.article.update({
      where: { id: comment.articleId },
      data: { commentCount: { decrement: 1 } },
    });
  }

  async getPending() {
    return prisma.comment.findMany({
      where: { isApproved: false },
      include: {
        author: {
          select: { id: true, name: true, username: true },
        },
        article: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}