import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API = 'http://localhost:8000/api/v1';

async function getArticles() {
  try {
    const res = await fetch(`${API}/articles?status=PUBLISHED&limit=20`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getBreaking() {
  try {
    const res = await fetch(`${API}/articles/breaking`, { next: { revalidate: 30 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getTrending() {
  try {
    const res = await fetch(`${API}/articles/trending`, { next: { revalidate: 120 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return `${Math.floor(hrs / 24)} দিন আগে`;
}

export default async function HomePage() {
  const [articles, breaking, trending] = await Promise.all([getArticles(), getBreaking(), getTrending()]);

  const featured = articles[0];
  const secondary = articles.slice(1, 4);
  const latest = articles.slice(4, 12);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F]">

        {/* Breaking News Ticker */}
        {breaking.length > 0 && (
          <div className="bg-[#E53E3E] text-white py-2 overflow-hidden">
            <div className="flex items-center">
              <span className="bg-white text-[#E53E3E] font-bold text-xs px-3 py-1 shrink-0 mx-4 uppercase tracking-wider">
                ব্রেকিং
              </span>
              <div className="overflow-hidden flex-1">
                <div className="ticker-animation whitespace-nowrap text-sm font-medium">
                  {breaking.map((a: any, i: number) => (
                    <Link key={a.id} href={`/news/${a.slug}`} className="hover:underline">
                      {i > 0 && <span className="mx-6 opacity-60">◆</span>}
                      {a.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Hero Section */}
          {featured && (
            <section className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main featured */}
                <div className="lg:col-span-2">
                  <Link href={`/news/${featured.slug}`} className="group block article-card">
                    <div className="relative h-80 lg:h-[420px] bg-[#111118] rounded-lg overflow-hidden">
                      {featured.thumbnail ? (
                        <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1E1E2E] to-[#111118] flex items-center justify-center">
                          <span className="text-6xl opacity-20">BCN</span>
                        </div>
                      )}
                      <div className="absolute inset-0 img-overlay" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {featured.category && (
                          <span className="inline-block bg-[#E53E3E] text-white text-xs px-2 py-1 rounded mb-3 uppercase tracking-wider font-medium">
                            {featured.category.name}
                          </span>
                        )}
                        <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 group-hover:text-[#F6AD55] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                          {featured.title}
                        </h1>
                        {featured.excerpt && (
                          <p className="text-[#94A3B8] text-sm line-clamp-2">{featured.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 mt-3 text-xs text-[#64748B]">
                          <span>{featured.author?.name}</span>
                          <span>•</span>
                          <span>{timeAgo(featured.publishedAt || featured.createdAt)}</span>
                          <span>•</span>
                          <span>👁 {Number(featured.viewCount).toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Secondary articles */}
                <div className="flex flex-col gap-4">
                  {secondary.map((article: any) => (
                    <Link key={article.id} href={`/news/${article.slug}`} className="group flex gap-3 article-card bg-[#111118] rounded-lg p-3">
                      <div className="w-24 h-20 shrink-0 bg-[#1E1E2E] rounded overflow-hidden">
                        {article.thumbnail ? (
                          <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs">BCN</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {article.category && (
                          <span className="text-[#E53E3E] text-xs font-medium uppercase">{article.category.name}</span>
                        )}
                        <h3 className="text-sm font-semibold text-[#E2E8F0] line-clamp-2 mt-1 group-hover:text-[#E53E3E] transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-1">{timeAgo(article.publishedAt || article.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Latest + Trending */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest News */}
            <section className="lg:col-span-2">
              <div className="red-line mb-6">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>সর্বশেষ সংবাদ</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {latest.map((article: any) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="group article-card bg-[#111118] rounded-lg overflow-hidden border border-[#1E1E2E] hover:border-[#E53E3E]/40 transition-colors">
                    <div className="h-40 bg-[#1E1E2E] overflow-hidden">
                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#64748B] text-sm">BCN</div>
                      )}
                    </div>
                    <div className="p-4">
                      {article.category && (
                        <span className="text-[#E53E3E] text-xs font-medium uppercase">{article.category.name}</span>
                      )}
                      <h3 className="text-sm font-semibold text-[#E2E8F0] line-clamp-2 mt-1 mb-2 group-hover:text-[#E53E3E] transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-[#64748B]">
                        <span>{article.author?.name}</span>
                        <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Trending Sidebar */}
            <section>
              <div className="red-line mb-6">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>🔥 ট্রেন্ডিং</h2>
              </div>
              <div className="space-y-3">
                {trending.slice(0, 8).map((article: any, i: number) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="group flex gap-3 items-start py-3 border-b border-[#1E1E2E] last:border-0">
                    <span className="text-2xl font-bold text-[#1E1E2E] group-hover:text-[#E53E3E] transition-colors font-mono w-8 shrink-0 leading-none mt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      {article.category && (
                        <span className="text-[#E53E3E] text-xs font-medium uppercase">{article.category.name}</span>
                      )}
                      <h4 className="text-sm text-[#E2E8F0] group-hover:text-[#E53E3E] transition-colors leading-snug mt-0.5">
                        {article.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-1">👁 {Number(article.viewCount).toLocaleString('bn-BD')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}