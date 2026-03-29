import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function getArticles() {
  try {
    const res = await fetch(`${API}/articles?status=PUBLISHED&limit=20`, { next: { revalidate: 60 } });
    return (await res.json()).data || [];
  } catch { return []; }
}
async function getBreaking() {
  try {
    const res = await fetch(`${API}/articles/breaking`, { next: { revalidate: 30 } });
    return (await res.json()).data || [];
  } catch { return []; }
}
async function getTrending() {
  try {
    const res = await fetch(`${API}/articles/trending`, { next: { revalidate: 120 } });
    return (await res.json()).data || [];
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
      <main style={{ background:'var(--bg)', minHeight:'100vh' }}>

        {/* Breaking ticker */}
        {breaking.length > 0 && (
          <div style={{ background:'var(--accent-red)', borderBottom:'2px solid var(--gold)' }} className="py-2 overflow-hidden">
            <div className="flex items-center">
              <span className="shrink-0 px-4 text-xs font-black tracking-widest uppercase flex items-center gap-2 text-white" style={{ borderRight:'1px solid rgba(255,255,255,0.2)', minWidth:'7rem' }}>
                <span className="live-dot w-2 h-2 rounded-full bg-yellow-300 inline-block" />
                ব্রেকিং
              </span>
              <div className="overflow-hidden flex-1 ml-4">
                <div className="ticker-move whitespace-nowrap text-sm text-white font-medium">
                  {breaking.map((a: any, i: number) => (
                    <Link key={a.id} href={`/news/${a.slug}`} className="hover:text-yellow-200 transition-colors">
                      {i > 0 && <span className="mx-6 opacity-40">◆</span>}
                      {a.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Hero */}
          {featured && (
            <section className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <Link href={`/news/${featured.slug}`} className="group block card-hover rounded-xl overflow-hidden"
                    style={{ border:'1px solid var(--border)', background:'var(--card)' }}>
                    <div className="relative h-80 lg:h-[420px] overflow-hidden" style={{ background:'var(--bg3)' }}>
                      {featured.thumbnail
                        ? <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center text-6xl font-black opacity-10" style={{ color:'var(--gold)' }}>BCN</div>
                      }
                      <div className="absolute inset-0 img-overlay" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {featured.isBreaking && (
                          <span className="inline-block text-xs px-2 py-1 rounded mr-2 font-bold uppercase tracking-wider text-white" style={{ background:'var(--accent-red)' }}>ব্রেকিং</span>
                        )}
                        {featured.category && (
                          <span className="inline-block text-xs px-2 py-1 rounded mb-3 font-medium uppercase tracking-wider" style={{ background:'rgba(201,162,39,0.2)', color:'var(--gold)', border:'1px solid rgba(201,162,39,0.4)' }}>
                            {featured.category.name}
                          </span>
                        )}
                        <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 group-hover:text-yellow-300 transition-colors">{featured.title}</h1>
                        {featured.excerpt && <p className="text-sm text-gray-300 opacity-80 line-clamp-2">{featured.excerpt}</p>}
                        <div className="flex items-center gap-3 mt-3 text-xs" style={{ color:'rgba(201,162,39,0.8)' }}>
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

                <div className="flex flex-col gap-3">
                  {secondary.map((a: any) => (
                    <Link key={a.id} href={`/news/${a.slug}`} className="group flex gap-3 card-hover rounded-xl p-3"
                      style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                      <div className="w-24 h-20 shrink-0 rounded-lg overflow-hidden" style={{ background:'var(--bg3)' }}>
                        {a.thumbnail
                          ? <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          : <div className="w-full h-full flex items-center justify-center text-xs font-bold opacity-20" style={{ color:'var(--gold)' }}>BCN</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        {a.category && <span className="text-[11px] font-semibold uppercase" style={{ color:'var(--gold)' }}>{a.category.name}</span>}
                        <h3 className="text-sm font-semibold line-clamp-2 mt-0.5 transition-colors group-hover:text-[var(--gold)] leading-snug" style={{ color:'var(--text)' }}>{a.title}</h3>
                        <p className="text-xs mt-1" style={{ color:'var(--muted)' }}>{timeAgo(a.publishedAt || a.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <div className="gold-line mb-8 opacity-50" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest */}
            <section className="lg:col-span-2">
              <div className="section-title">সর্বশেষ সংবাদ</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {latest.map((a: any) => (
                  <Link key={a.id} href={`/news/${a.slug}`} className="group card-hover rounded-xl overflow-hidden"
                    style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                    <div className="h-44 overflow-hidden" style={{ background:'var(--bg3)' }}>
                      {a.thumbnail
                        ? <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl font-black opacity-10" style={{ color:'var(--gold)' }}>BCN</div>
                      }
                    </div>
                    <div className="p-4">
                      {a.category && <span className="text-[11px] font-semibold uppercase" style={{ color:'var(--gold)' }}>{a.category.name}</span>}
                      <h3 className="text-sm font-semibold line-clamp-2 mt-1 mb-3 transition-colors group-hover:text-[var(--gold)] leading-snug" style={{ color:'var(--text)' }}>{a.title}</h3>
                      <div className="flex items-center justify-between text-xs pt-2" style={{ color:'var(--muted)', borderTop:'1px solid var(--border)' }}>
                        <span>{a.author?.name}</span>
                        <span>{timeAgo(a.publishedAt || a.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Trending */}
            <section>
              <div className="section-title">🔥 ট্রেন্ডিং</div>
              <div>
                {trending.slice(0, 8).map((a: any, i: number) => (
                  <Link key={a.id} href={`/news/${a.slug}`} className="group flex gap-3 items-start py-4"
                    style={{ borderBottom:'1px solid var(--border)' }}>
                    <span className="text-2xl font-black w-8 shrink-0 leading-none mt-1 transition-colors"
                      style={{ color: i < 3 ? 'var(--gold)' : 'var(--border)', fontFamily:'monospace' }}>
                      {String(i+1).padStart(2,'0')}
                    </span>
                    <div>
                      {a.category && <span className="text-[11px] font-semibold uppercase" style={{ color:'var(--gold)', opacity:0.8 }}>{a.category.name}</span>}
                      <h4 className="text-sm font-medium line-clamp-2 mt-0.5 transition-colors group-hover:text-[var(--gold)] leading-snug" style={{ color:'var(--text2)' }}>{a.title}</h4>
                      <p className="text-xs mt-1" style={{ color:'var(--muted)' }}>👁 {Number(a.viewCount).toLocaleString('bn-BD')}</p>
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
