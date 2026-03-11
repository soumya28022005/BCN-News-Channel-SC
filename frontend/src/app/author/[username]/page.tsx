import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

const API = 'http://localhost:8000/api/v1';

async function getAuthor(username: string) {
  try {
    const res = await fetch(`${API}/users/${username}`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.data || null;
  } catch { return null; }
}

async function getAuthorArticles(username: string) {
  try {
    const res = await fetch(`${API}/articles?author=${username}&status=PUBLISHED&limit=20`, { next: { revalidate: 60 } });
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

export default async function AuthorPage({ params }: { params: { username: string } }) {
  const [author, articles] = await Promise.all([
    getAuthor(params.username),
    getAuthorArticles(params.username),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F]">
        {/* Author Profile */}
        <div className="bg-[#111118] border-b border-[#1E1E2E] py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-xs text-[#64748B] mb-6">
              <Link href="/" className="hover:text-[#E53E3E]">হোম</Link>
              <span className="mx-2">/</span>
              <span className="text-[#E2E8F0]">{author?.name || params.username}</span>
            </nav>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#E53E3E] flex items-center justify-center text-white text-3xl font-bold shrink-0">
                {author?.name?.charAt(0) || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {author?.name || params.username}
                </h1>
                {author?.authorProfile?.title && (
                  <p className="text-[#E53E3E] text-sm mt-1">{author.authorProfile.title}</p>
                )}
                {author?.authorProfile?.bio && (
                  <p className="text-[#64748B] text-sm mt-2 max-w-xl">{author.authorProfile.bio}</p>
                )}
                <p className="text-[#64748B] text-xs mt-2">{articles.length}টি প্রতিবেদন</p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="red-line mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              প্রতিবেদনসমূহ
            </h2>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#64748B]">কোনো প্রতিবেদন নেই</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group article-card bg-[#111118] rounded-lg overflow-hidden border border-[#1E1E2E] hover:border-[#E53E3E]/40 transition-colors">
                  <div className="h-44 bg-[#1E1E2E] overflow-hidden">
                    {article.thumbnail ? (
                      <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#64748B]">BCN</div>
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
                      <span>👁 {Number(article.viewCount).toLocaleString('bn-BD')}</span>
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