import type { MetadataRoute } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bcnnetwork.in';

async function safeJson(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlesRes, categoriesRes] = await Promise.all([
    safeJson(`${API}/articles?status=PUBLISHED&limit=200`),
    safeJson(`${API}/categories`),
  ]);

  const articles = articlesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/search`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE}/trending`, changeFrequency: 'hourly', priority: 0.9 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article: any) => ({
    url: `${SITE}/news/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt || article.createdAt,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${SITE}/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
