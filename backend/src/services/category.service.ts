import { prisma } from '../config/database';
import slugify from 'slugify';
import { AppError } from '../utils/AppError';


export class CategoryService {

  async findAll() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { articles: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        _count: { select: { articles: true } },
      },
    });
    if (!category) throw new AppError('Category not found', 404);
    return category;
  }

  async findById(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError('Category not found', 404);
    return category;
  }

  async create(data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parentId?: string;
  }) {
    const slug = slugify(data.name, { lower: true, strict: true });

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) throw new AppError('Category with this name already exists', 409);

    return prisma.category.create({
      data: { ...data, slug },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    const articleCount = await prisma.article.count({ where: { categoryId: id } });
    if (articleCount > 0) {
      throw new AppError(`Cannot delete category with ${articleCount} articles`, 400);
    }
    return prisma.category.delete({ where: { id } });
  }
}