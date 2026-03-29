/**
 * BCN – Sitemap & Robots Routes
 * Critical for Google indexing
 */

import { Router, Request, Response } from 'express';
import { ArticleStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { SeoService } from '../services/seo.service';
import { CacheService } from '../services/cache.service';
import { config } from '../config/env';

const router = Router();
const seoService = new SeoService();
const cacheService = new CacheService();

// ─── ROBOTS.TXT ────────────────────────────────────────────────────
router.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

# Sitemaps
Sitemap: ${config.SITE_URL}/sitemap.xml
Sitemap: ${config.SITE_URL}/sitemap-news.xml
Sitemap: ${config.SITE_URL}/sitemap-categories.xml

# Disallow admin paths
Disallow: /admin/
Disallow: /api/
Disallow: /auth/

# Crawl delay
Crawl-delay: 1
`);
});

// ─── MAIN SITEMAP INDEX ────────────────────────────────────────────
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  const now = new Date().toISOString();

  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${config.SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${config.SITE_URL}/sitemap-categories.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${config.SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`);
});

// ─── NEWS SITEMAP (for Google News) ───────────────────────────────
router.get('/sitemap-news.xml', async (req: Request, res: Response) => {
  const cacheKey = 'sitemap:news';
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    res.type('application/xml');
    return res.send(cached);
  }

  // Get articles published in last 2 days (Google News requirement)
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const articles = await prisma.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      publishedAt: { gte: twoDaysAgo },
    },
    select: {
      slug: true,
      title: true,
      publishedAt: true,
      updatedAt: true,
      seoKeywords: true,
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 1000,
  });

  const xml = await seoService.generateSitemapXml(articles, []);

  await cacheService.set(cacheKey, xml, 1800); // 30 min
  res.type('application/xml');
  res.send(xml);
});

// ─── CATEGORIES SITEMAP ────────────────────────────────────────────
router.get('/sitemap-categories.xml', async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const now = new Date().toISOString();
  const entries = categories.map((cat: { slug: any; updatedAt: { toISOString: () => any; }; }) => `
  <url>
    <loc>${config.SITE_URL}/category/${cat.slug}</loc>
    <lastmod>${cat.updatedAt.toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`);
});

// ─── STATIC SITEMAP ────────────────────────────────────────────────
router.get('/sitemap-static.xml', (req: Request, res: Response) => {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'always' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/search', priority: '0.8', changefreq: 'daily' },
    { url: '/trending', priority: '0.9', changefreq: 'hourly' },
    { url: '/latest', priority: '0.9', changefreq: 'always' },
  ];

  const entries = staticPages.map(page => `
  <url>
    <loc>${config.SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`);
});

export default router;