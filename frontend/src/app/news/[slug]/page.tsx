import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API}/articles/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.article || data.data || data;
  } catch (err) { 
    console.error("Fetch Error:", err);
    return null; 
  }
}

async function getRelated(slug: string) {
  try {
    const res = await fetch(`${API}/articles/${slug}/related`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.articles || data.data || [];
  } catch { return []; }
}

function timeAgo(date: string) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return new Date(date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, related] = await Promise.all([getArticle(slug), getRelated(slug)]);

  if (!article || !article.title) {
    return notFound();
  }

  return (
    <>
      <Header />
      {/* 1. Main Background fixed using var(--bg) and var(--text) */}
      <main className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              
              <div className="flex items-center gap-3 mb-4">
                {article.category && (
                  // 2. Category badge fixed using var(--accent-red)
                  <span className="text-white text-xs px-2 py-1 rounded font-medium tracking-wide" style={{ background: 'var(--accent-red)' }}>
                    {article.category.name}
                  </span>
                )}
                {/* Added time alongside category for better layout */}
                <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                  {timeAgo(article.publishedAt || article.createdAt)}
                </span>
              </div>

              {/* 3. Title fixed using var(--text) and Playfair font */}
              <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight transition-colors" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
                {article.title}
              </h1>

              {article.thumbnail && (
                // 4. Border and background fixed using var(--border)
                <div className="mb-8 rounded-xl overflow-hidden border transition-colors" style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
                  <img 
                    src={article.thumbnail} 
                    alt={article.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* 5. Main Content Area fixed by removing prose-invert and using your custom article-content class */}
              <div 
                className="prose max-w-none text-lg leading-relaxed article-content transition-colors"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
            </article>

            {/* Sidebar */}
            <aside>
              {/* 6. Sidebar heading border fixed using var(--accent-red) */}
              <h3 className="text-xl font-bold mb-4 border-l-4 pl-3 transition-colors" style={{ borderColor: 'var(--accent-red)', color: 'var(--text)' }}>
                সম্পর্কিত সংবাদ
              </h3>
              <div className="space-y-4">
                {related.length > 0 ? (
                  related.map((item: any) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="block group border-b pb-3 last:border-0" style={{ borderColor: 'var(--border)' }}>
                      {/* 7. Sidebar links fixed to use var(--text) and hover gold */}
                      <h4 className="transition-colors leading-snug font-medium group-hover:text-[var(--gold)]" style={{ color: 'var(--text)' }}>
                        {item.title}
                      </h4>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                        {timeAgo(item.publishedAt || item.createdAt)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>কোনো সম্পর্কিত সংবাদ পাওয়া যায়নি।</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}