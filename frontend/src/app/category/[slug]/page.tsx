import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

const API = 'http://localhost:8000/api/v1';

async function getCategoryArticles(slug: string) {
  try {
    const res = await fetch(`${API}/articles?category=${slug}&status=PUBLISHED&limit=20`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getCategory(slug: string) {
  try {
    const res = await fetch(`${API}/categories/${slug}`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.data || null;
  } catch { return null; }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return `${Math.floor(hrs / 24)} দিন আগে`;
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [articles, category] = await Promise.all([
    getCategoryArticles(slug),
    getCategory(slug),
  ]);

  const categoryName = category?.name || slug;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F]">
        <div className="bg-[#111118] border-b border-[#1E1E2E] py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-xs text-[#64748B] mb-4">
              <Link href="/" className="hover:text-[#E53E3E]">হোম</Link>
              <span className="mx-2">/</span>
              <span className="text-[#E2E8F0]">{categoryName}</span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 bg-[#E53E3E] rounded" />
              <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {categoryName}
                </h1>
                <p className="text-[#64748B] text-sm mt-1">{articles.length}টি সংবাদ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#64748B] text-lg">এই বিভাগে কোনো সংবাদ নেই</p>
              <Link href="/" className="text-[#E53E3E] text-sm mt-4 inline-block hover:underline">হোমে ফিরে যাও</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group article-card bg-[#111118] rounded-lg overflow-hidden border border-[#1E1E2E] hover:border-[#E53E3E]/40 transition-colors">
                  <div className="h-48 bg-[#1E1E2E] overflow-hidden">
                    {article.thumbnail ? (
                      <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#64748B]">BCN</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {article.isBreaking && (
                        <span className="bg-[#E53E3E] text-white text-xs px-2 py-0.5 rounded uppercase font-bold">ব্রেকিং</span>
                      )}
                      {article.isFeatured && (
                        <span className="bg-[#1E1E2E] text-[#F6AD55] text-xs px-2 py-0.5 rounded uppercase">ফিচার্ড</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#E2E8F0] line-clamp-2 mb-2 group-hover:text-[#E53E3E] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <span>{article.author?.name}</span>
                      <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}