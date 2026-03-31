/**
 * BCN – SEO Service
 * Automatic SEO metadata generation, analysis, and scoring
 */

import { config } from '../config/env';

interface SeoInput {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAt?: Date;
  slug?: string;
  thumbnailUrl?: string;
}

interface SeoOutput {
  title: string;
  description: string;
  keywords: string[];
  jsonLd: object;
  openGraph: object;
  twitterCard: object;
  seoScore: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  suggestions: string[];
  internalLinkSuggestions: string[];
}

export class SeoService {

  // ─── GENERATE FULL SEO METADATA ───────────────────────────────────
  async generateSeoMetadata(input: SeoInput): Promise<SeoOutput> {
    const cleanContent = this.stripHtml(input.content);

    const title = this.generateSeoTitle(input.title);
    const description = this.generateSeoDescription(input.excerpt || cleanContent);
    const keywords = this.extractKeywords(cleanContent, input.title);
    const keywordDensity = this.calculateKeywordDensity(cleanContent, keywords);
    const seoScore = this.calculateSeoScore({ title, description, keywords, content: cleanContent });
    const readabilityScore = this.calculateReadabilityScore(cleanContent);
    const suggestions = this.generateSuggestions({ title, description, keywords, content: cleanContent, seoScore });
    const jsonLd = this.generateArticleJsonLd(input, description, keywords);
    const openGraph = this.generateOpenGraph(input, description);
    const twitterCard = this.generateTwitterCard(input, description);
    const internalLinkSuggestions: string[] = [];

    return {
      title,
      description,
      keywords,
      jsonLd,
      openGraph,
      twitterCard,
      seoScore,
      readabilityScore,
      keywordDensity,
      suggestions,
      internalLinkSuggestions,
    };
  }

  // ─── GENERATE SEO TITLE ────────────────────────────────────────────
  private generateSeoTitle(title: string): string {
    const maxLength = 60;
    const suffix = ' | BCN';

    const withSuffix = `${title}${suffix}`;
    if (withSuffix.length <= maxLength) return withSuffix;

    // Truncate title to fit within 60 chars
    const maxTitleLength = maxLength - suffix.length - 3; // 3 for '...'
    return `${title.substring(0, maxTitleLength)}...${suffix}`;
  }

  // ─── GENERATE SEO DESCRIPTION ──────────────────────────────────────
  private generateSeoDescription(text: string): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    const maxLength = 160;

    if (clean.length <= maxLength) return clean;

    // Find last complete sentence within 160 chars
    const truncated = clean.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastPeriod > 100) return clean.substring(0, lastPeriod + 1);
    if (lastSpace > 100) return `${clean.substring(0, lastSpace)}...`;

    return `${truncated}...`;
  }

  // ─── EXTRACT KEYWORDS ──────────────────────────────────────────────
  private extractKeywords(content: string, title: string): string[] {
    // Common stop words to filter
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'been', 'be',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'shall', 'can', 'this', 'that', 'these',
      'those', 'it', 'its', 'said', 'also', 'as', 'he', 'she', 'they',
      'we', 'you', 'i', 'his', 'her', 'their', 'our', 'your', 'my',
      'bangla', 'বাংলা', 'এই', 'এবং', 'করে', 'করা', 'হয়', 'হচ্ছে', 'ছিল', 'থেকে', 'জন্য', 'একটি', 'তার', 'তাদের',
    ]);

    const text = `${title} ${title} ${content}`.toLowerCase();
   const words = text.match(/[\u0980-\u09FFa-zA-Z]{2,}/g) || [];

    // Count word frequency
    const freq: Record<string, number> = {};
    words.forEach(word => {
      if (!stopWords.has(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });

    // Sort by frequency and take top 15
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([word]) => word);
  }

  // ─── CALCULATE KEYWORD DENSITY ─────────────────────────────────────
  private calculateKeywordDensity(content: string, keywords: string[]): Record<string, number> {
    const words = content.toLowerCase().match(/[\u0980-\u09FFa-zA-Z]+/g) || [];
    const totalWords = words.length;
    const density: Record<string, number> = {};

    keywords.slice(0, 10).forEach(keyword => {
      const count = words.filter(w => w === keyword).length;
      density[keyword] = Math.round((count / totalWords) * 1000) / 10; // percentage with 1 decimal
    });

    return density;
  }

  // ─── CALCULATE SEO SCORE ───────────────────────────────────────────
  private calculateSeoScore(input: {
    title: string;
    description: string;
    keywords: string[];
    content: string;
  }): number {
    let score = 0;
    const checks: Array<{ weight: number; pass: boolean; name: string }> = [];

    // Title length (60 chars ideal)
    const titleLen = input.title.length;
    checks.push({ weight: 15, pass: titleLen >= 30 && titleLen <= 60, name: 'Title length' });

    // Description length (120-160 chars ideal)
    const descLen = input.description.length;
    checks.push({ weight: 15, pass: descLen >= 120 && descLen <= 160, name: 'Description length' });

    // Has keywords
    checks.push({ weight: 10, pass: input.keywords.length >= 5, name: 'Has keywords' });

    // Content length (>300 words)
    const wordCount = input.content.split(/\s+/).length;
    checks.push({ weight: 20, pass: wordCount >= 300, name: 'Content length' });

    // Keyword in title
    const primaryKeyword = input.keywords[0] || '';
    checks.push({
      weight: 15,
      pass: input.title.toLowerCase().includes(primaryKeyword),
      name: 'Keyword in title'
    });

    // Keyword in description
    checks.push({
      weight: 10,
      pass: input.description.toLowerCase().includes(primaryKeyword),
      name: 'Keyword in description'
    });

    // Contains "BCN" or brand name
    checks.push({
      weight: 15,
      pass: input.title.includes('BCN') || input.title.toLowerCase().includes('bengal chronicle'),
      name: 'Brand in title'
    });

    checks.forEach(check => {
      if (check.pass) score += check.weight;
    });

    return Math.min(score, 100);
  }

  // ─── READABILITY SCORE (Flesch-Kincaid inspired) ───────────────────
  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?।]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((acc, word) => acc + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 50;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    const vowelGroups = word.match(/[aeiou]+/g);
    return vowelGroups ? vowelGroups.length : 1;
  }

  // ─── GENERATE SUGGESTIONS ──────────────────────────────────────────
  private generateSuggestions(input: {
    title: string;
    description: string;
    keywords: string[];
    content: string;
    seoScore: number;
  }): string[] {
    const suggestions: string[] = [];

    if (input.title.length < 30) {
      suggestions.push('📝 Title is too short. Aim for 30-60 characters for best SEO performance.');
    }
    if (input.title.length > 60) {
      suggestions.push('✂️ Title is too long. Keep it under 60 characters to avoid truncation in search results.');
    }
    if (input.description.length < 120) {
      suggestions.push('📄 Meta description is too short. Aim for 120-160 characters.');
    }
    if (!input.title.includes('BCN') && !input.title.toLowerCase().includes('bengal chronicle')) {
      suggestions.push('🏷️ Add "BCN" or "Bengal Chronicle" to the title to boost brand visibility.');
    }

    const wordCount = input.content.split(/\s+/).length;
    if (wordCount < 300) {
      suggestions.push('📰 Article is too short. Aim for at least 300 words for better ranking.');
    }
    if (wordCount < 600) {
      suggestions.push('💡 Longer articles (600+ words) tend to rank better. Consider expanding the content.');
    }

    if (input.keywords.length < 5) {
      suggestions.push('🔑 Add more relevant keywords to improve discoverability.');
    }

    if (input.seoScore < 50) {
      suggestions.push('⚠️ SEO score is low. Address the above suggestions to improve ranking.');
    } else if (input.seoScore >= 80) {
      suggestions.push('✅ Great SEO score! This article is well-optimized for search engines.');
    }

    return suggestions;
  }

  // ─── GENERATE ARTICLE JSON-LD SCHEMA ──────────────────────────────
  generateArticleJsonLd(article: Partial<SeoInput & {
    slug?: string;
    author?: string;
    publishedAt?: Date;
    thumbnailUrl?: string;
    category?: string;
  }>, description?: string, keywords?: string[]): object {
    const articleUrl = article.slug
      ? `${config.SITE_URL}/news/${article.slug}`
      : config.SITE_URL;

    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'description': description || article.excerpt,
      'url': articleUrl,
      'datePublished': article.publishedAt?.toISOString() || new Date().toISOString(),
      'dateModified': new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': article.author || 'BCN Staff',
        'url': `${config.SITE_URL}/author/${article.author}`,
      },
      'publisher': {
        '@type': 'NewsMediaOrganization',
        'name': 'BCN – The Bengal Chronicle Network',
        'url': config.SITE_URL,
        'logo': {
          '@type': 'ImageObject',
          'url': `${config.SITE_URL}/logo.png`,
          'width': 600,
          'height': 60,
        },
      },
      'image': article.thumbnailUrl ? {
        '@type': 'ImageObject',
        'url': article.thumbnailUrl,
        'width': 1200,
        'height': 630,
      } : undefined,
      'articleSection': article.category,
      'keywords': keywords?.join(', '),
      'inLanguage': 'bn',
      'isAccessibleForFree': true,
    };
  }

  // ─── OPEN GRAPH TAGS ──────────────────────────────────────────────
  private generateOpenGraph(article: Partial<SeoInput>, description: string): object {
    return {
      'og:type': 'article',
      'og:site_name': 'BCN – The Bengal Chronicle Network',
      'og:title': article.title,
      'og:description': description,
      'og:url': article.slug ? `${config.SITE_URL}/news/${article.slug}` : config.SITE_URL,
      'og:image': article.thumbnailUrl || `${config.SITE_URL}/og-default.jpg`,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:locale': 'bn_IN',
      ...(article.publishedAt && {
        'article:published_time': article.publishedAt.toISOString(),
        'article:author': article.author,
        'article:section': article.category,
        'article:tag': article.tags?.join(', '),
      }),
    };
  }

  // ─── TWITTER CARD ─────────────────────────────────────────────────
  private generateTwitterCard(article: Partial<SeoInput>, description: string): object {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@BCN_Bengal',
      'twitter:creator': '@BCN_Bengal',
      'twitter:title': article.title,
      'twitter:description': description,
      'twitter:image': article.thumbnailUrl || `${config.SITE_URL}/og-default.jpg`,
      'twitter:image:alt': article.title,
    };
  }

  // ─── ANALYZE EXISTING ARTICLE ──────────────────────────────────────
  async analyzeArticle(article: any): Promise<object> {
    const cleanContent = this.stripHtml(article.content || '');
    const keywords = this.extractKeywords(cleanContent, article.title);
    const seoScore = this.calculateSeoScore({
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || '',
      keywords,
      content: cleanContent,
    });
    const readabilityScore = this.calculateReadabilityScore(cleanContent);
    const keywordDensity = this.calculateKeywordDensity(cleanContent, keywords);
    const suggestions = this.generateSuggestions({
      title: article.seoTitle || article.title,
      description: article.seoDescription || '',
      keywords,
      content: cleanContent,
      seoScore,
    });

    return {
      seoScore,
      readabilityScore,
      keywordDensity,
      wordCount: cleanContent.split(/\s+/).length,
      sentenceCount: cleanContent.split(/[.!?]+/).length,
      suggestions,
      keywords,
      titleLength: (article.seoTitle || article.title).length,
      descriptionLength: (article.seoDescription || '').length,
    };
  }

  // ─── GENERATE SITEMAP DATA ────────────────────────────────────────
  async generateSitemapXml(articles: any[], categories: any[]): Promise<string> {
    const now = new Date().toISOString();

    const articleEntries = articles.map(article => `
  <url>
    <loc>${config.SITE_URL}/news/${article.slug}</loc>
    <lastmod>${article.updatedAt?.toISOString() || now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>BCN – The Bengal Chronicle Network</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt?.toISOString() || now}</news:publication_date>
      <news:title>${this.escapeXml(article.title)}</news:title>
      <news:keywords>${article.seoKeywords?.join(', ')}</news:keywords>
    </news:news>
  </url>`).join('\n');

    const categoryEntries = categories.map(cat => `
  <url>
    <loc>${config.SITE_URL}/category/${cat.slug}</loc>
    <lastmod>${cat.updatedAt?.toISOString() || now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <url>
    <loc>${config.SITE_URL}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>

${categoryEntries}
${articleEntries}
</urlset>`;
  }

  // ─── HELPERS ──────────────────────────────────────────────────────
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}