import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import FixedAd from '../../../components/ads/FixedAd';
import { apiUrl, SITE_URL } from '../../../lib/config';

type ArticleAuthor = {
  name?: string;
};

type ArticleCategory = {
  name?: string;
  slug?: string;
};

type Article = {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  source?: string;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  author?: ArticleAuthor | null;
  category?: ArticleCategory | null;
};

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(apiUrl(`/articles/${slug}`), {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.data?.article || data?.data || data || null;
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}

async function getRelated(slug: string): Promise<Article[]> {
  try {
    const res = await fetch(apiUrl(`/articles/${slug}/related`), {
      next: { revalidate: 120 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data?.data?.articles || data?.data || [];
  } catch (error) {
    console.error('Failed to fetch related articles:', error);
    return [];
  }
}

function formatBanglaDate(date?: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function timeAgo(date?: string) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 60) return `${mins} মিনিট আগে`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;

  return formatBanglaDate(date);
}

function getSafeSourceUrl(source?: string) {
  if (!source) return null;

  try {
    const normalized = source.startsWith('http://') || source.startsWith('https://')
      ? source
      : `https://${source}`;

    const parsed = new URL(normalized);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'সংবাদ পাওয়া যায়নি | BCN',
      description: 'এই সংবাদটি পাওয়া যায়নি।',
    };
  }

  const title = `${article.title} | BCN`;
  const description = article.excerpt || article.title;
  const imageUrl = article.thumbnail || `${SITE_URL}/default-share.jpg`;
  const articleUrl = `${SITE_URL}/news/${article.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: 'BCN – The Bengal Chronicle Network',
      type: 'article',
      locale: 'bn_BD',
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt || article.createdAt,
      authors: [article.author?.name || 'BCN Desk'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article, related] = await Promise.all([
    getArticle(slug),
    getRelated(slug),
  ]);

  if (!article || !article.title) {
    notFound();
  }

  const articleUrl = `${SITE_URL}/news/${article.slug}`;
  const imageUrl = article.thumbnail || `${SITE_URL}/default-share.jpg`;
  const sourceUrl = getSafeSourceUrl(article.source);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.title,
    description: article.excerpt || article.title,
    image: [imageUrl],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: [
      {
        '@type': 'Person',
        name: article.author?.name || 'BCN Desk',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'BCN – The Bengal Chronicle Network',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'হোম',
        item: SITE_URL,
      },
      ...(article.category?.name
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: article.category.name,
              item: `${SITE_URL}/category/${article.category.slug || ''}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: article.category?.name ? 3 : 2,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main
        className="min-h-screen transition-colors duration-300"
        style={{ background: 'var(--bg)', color: 'var(--text)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm flex flex-wrap items-center gap-2"
            style={{ color: 'var(--muted)' }}
          >
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">
              হোম
            </Link>

            <span>/</span>

            {article.category?.name ? (
              <>
                <Link
                  href={`/category/${article.category.slug}`}
                  className="hover:text-[var(--gold)] transition-colors"
                >
                  {article.category.name}
                </Link>
                <span>/</span>
              </>
            ) : null}

            <span className="truncate" style={{ color: 'var(--text)' }}>
              {article.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {article.category?.name && (
                  <span
                    className="text-white text-xs px-2 py-1 rounded font-medium tracking-wide"
                    style={{ background: 'var(--accent-red)' }}
                  >
                    {article.category.name}
                  </span>
                )}

                <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                  {timeAgo(article.publishedAt || article.createdAt)}
                </span>

                {article.author?.name && (
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    • {article.author.name}
                  </span>
                )}
              </div>

              <h1
                className="text-3xl lg:text-5xl font-bold mb-6 leading-tight transition-colors"
                style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
              >
                {article.title}
              </h1>

              {article.excerpt && (
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {article.excerpt}
                </p>
              )}

              {article.thumbnail && (
                <div
                  className="mb-8 rounded-xl overflow-hidden border transition-colors relative w-full"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg3)',
                    aspectRatio: '16/9',
                  }}
                >
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div
                className="prose max-w-none text-lg leading-relaxed article-content transition-colors prose-img:rounded-xl prose-img:w-full prose-img:shadow-md mb-10"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />

              {sourceUrl && (
                <div
                  className="mt-12 p-6 rounded-xl border border-dashed transition-colors"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span
                      className="font-bold tracking-widest text-xs uppercase opacity-60"
                      style={{ fontFamily: 'monospace' }}
                    >
                      Reference / সোর্স:
                    </span>

                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-bold text-lg underline underline-offset-8 decoration-2 transition-all hover:opacity-80 break-all"
                      style={{ color: 'var(--accent-red)' }}
                    >
                      Read More / বিস্তারিত পড়ুন ↗️
                    </a>
                  </div>
                </div>
              )}
            </article>

            <aside>
              <h3
                className="text-xl font-bold mb-4 border-l-4 pl-3 transition-colors"
                style={{ borderColor: 'var(--accent-red)', color: 'var(--text)' }}
              >
                সম্পর্কিত সংবাদ
              </h3>

              <div className="space-y-4 mb-10">
                {related.length > 0 ? (
                  related.map((item) => (
                    <Link
                      key={item.id || item.slug}
                      href={`/news/${item.slug}`}
                      className="block group border-b pb-3 last:border-0"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <h4
                        className="transition-colors leading-snug font-medium group-hover:text-[var(--gold)]"
                        style={{ color: 'var(--text)' }}
                      >
                        {item.title}
                      </h4>

                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                        {timeAgo(item.publishedAt || item.createdAt)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    কোনো সম্পর্কিত সংবাদ পাওয়া যায়নি।
                  </p>
                )}
              </div>

              <FixedAd />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
