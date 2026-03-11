import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

const API = 'http://localhost:8000/api/v1';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API}/articles/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.article || data.data || null;
  } catch { return null; }
}

async function getRelated(slug: string) {
  try {
    const res = await fetch(`${API}/articles/${slug}/related`, { cache: 'no-store' });
    const data = await res.json();
    return data.data?.articles || data.data || [];
  } catch { return []; }
}

function timeAgo(date: string) {
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
  if (!article) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Article */}
            <article className="lg:col-span-2">
              <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
                <Link href="/" className="hover:text-[#E53E3E]">হোম</Link>
                <span>/</span>
                {article.category && (
                  <>
                    <Link href={`/category/${article.category.slug}`} className="hover:text-[#E53E3E]">{article.category.name}</Link>
                    <span>/</span>
                  </>
                )}
                <span className="text-[#94A3B8] truncate max-w-[200px]">{article.title}</span>
              </nav>

              <div className="flex items-center gap-2 mb-4">
                {article.isBreaking && (
                  <span className="bg-[#E53E3E] text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-bold breaking-pulse">
                    ব্রেকিং
                  </span>
                )}
                {article.category && (
                  <Link href={`/category/${article.category.slug}`} className="bg-[#1E1E2E] text-[#E2E8F0] text-xs px-2 py-1 rounded uppercase tracking-wider hover:bg-[#E53E3E] hover:text-white transition-colors">
                    {article.category.name}
                  </Link>
                )}
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-lg text-[#94A3B8] border-l-2 border-[#E53E3E] pl-4 mb-6 italic">
                  {article.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] pb-6 border-b border-[#1E1E2E] mb-6">
                {article.author && (
                  <Link href={`/author/${article.author.username}`} className="flex items-center gap-2 hover:text-[#E53E3E] transition-colors">
                    <div className="w-7 h-7 rounded-full bg-[#E53E3E] flex items-center justify-center text-white text-xs font-bold">
                      {article.author.name?.charAt(0)}
                    </div>
                    <span className="font-medium text-[#E2E8F0]">{article.author.name}</span>
                  </Link>
                )}
                <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
                <span>👁 {Number(article.viewCount).toLocaleString('bn-BD')} বার পড়া হয়েছে</span>
                {article.readingTime && <span>📖 {article.readingTime} মিনিট</span>}
              </div>

              {article.thumbnail && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img src={article.thumbnail} alt={article.thumbnailAlt || article.title} className="w-full h-auto max-h-[500px] object-cover" />
                  {article.thumbnailCaption && (
                    <p className="text-xs text-[#64748B] mt-2 italic text-center">{article.thumbnailCaption}</p>
                  )}
                </div>
              )}

              <div
                className="article-content text-[#CBD5E1]"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#1E1E2E]">
                  <span className="text-xs text-[#64748B] uppercase tracking-wider mr-2">ট্যাগ:</span>
                  {article.tags.map((t: any) => (
                    <span key={t.tag?.id} className="bg-[#1E1E2E] text-[#94A3B8] text-xs px-3 py-1 rounded-full hover:bg-[#E53E3E] hover:text-white transition-colors cursor-pointer">
                      #{t.tag?.name}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {related.length > 0 && (
                <div>
                  <div className="red-line mb-4">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>সম্পর্কিত সংবাদ</h3>
                  </div>
                  <div className="space-y-4">
                    {related.slice(0, 5).map((a: any) => (
                      <Link key={a.id} href={`/news/${a.slug}`} className="group flex gap-3 items-start">
                        <div className="w-20 h-16 shrink-0 bg-[#1E1E2E] rounded overflow-hidden">
                          {a.thumbnail ? (
                            <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs">BCN</div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs text-[#E2E8F0] group-hover:text-[#E53E3E] transition-colors line-clamp-3 leading-snug">
                            {a.title}
                          </h4>
                          <p className="text-xs text-[#64748B] mt-1">{timeAgo(a.publishedAt || a.createdAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}