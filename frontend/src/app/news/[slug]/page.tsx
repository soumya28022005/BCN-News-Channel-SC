import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import FixedAd from '../../../components/ads/FixedAd';
import { apiUrl, SITE_URL } from '../../../lib/config'; // ✅ FIX 1: centralized config

async function getArticle(slug: string) {
  try {
    const res = await fetch(apiUrl(`/articles/${slug}`), {
      // ✅ FIX 3: ISR with 60s revalidation instead of cache:'no-store'
      // Article pages are now cached and fast. Revalidate when republished via revalidateTag.
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.article || data.data || data;
  } catch (err) {
    console.error('Fetch Error:', err);
    return null;
  }
}

async function getRelated(slug: string) {
  try {
    const res = await fetch(apiUrl(`/articles/${slug}/related`), {
      // ✅ FIX 3: related articles cached for 2 minutes instead of no-store
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.articles || data.data || [];
  } catch {
    return [];
  }
}

function timeAgo(date: string) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return new Date(date).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return { title: 'Not Found | BCN News' };

  const title = `${article.title} | BCN`;
  const description = article.excerpt || article.title;
  const imageUrl = article.thumbnail || `${SITE_URL}/default-share.jpg`;
  const articleUrl = `${SITE_URL}/news/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: 'BCN - The Bengal Chronicle Network',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
      type: 'article',
      publishedTime: article.publishedAt || article.createdAt,
      authors: [article.author?.name || 'BCN Desk'],
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
  const [article, related] = await Promise.all([getArticle(slug), getRelated(slug)]);

  if (!article || !article.title) {
    return notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.thumbnail || `${SITE_URL}/default-share.jpg`],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: [
      {
        '@type': 'Person',
        name: article.author?.name || 'BCN Desk',
        url: SITE_URL,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'BCN News',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    description: article.excerpt || article.title,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main
        className="min-h-screen transition-colors duration-300"
        style={{ background: 'var(--bg)', color: 'var(--text)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {article.category && (
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
              </div>

              <h1
                className="text-3xl lg:text-5xl font-bold mb-6 leading-tight transition-colors"
                style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
              >
                {article.title}
              </h1>

              {/* ✅ FIX 2: next/image instead of plain <img> for article thumbnail */}
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
                    priority // ✅ LCP image — load eagerly
                  />
                </div>
              )}

              <div
                className="prose max-w-none text-lg leading-relaxed article-content transition-colors prose-img:rounded-xl prose-img:w-full prose-img:shadow-md mb-10"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />

              {/* Source Section */}
              {article.source && (
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
                      href={
                        article.source.startsWith('http')
                          ? article.source
                          : `https://${article.source}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-lg underline underline-offset-8 decoration-2 transition-all hover:opacity-80"
                      style={{ color: 'var(--accent-red)' }}
                    >
                      Read More / বিস্তারিত পড়ুন ↗
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
                  related.map((item: any) => (
                    <Link
                      key={item.id}
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