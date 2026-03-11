import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

const API = 'http://localhost:8000/api/v1';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API}/articles/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Data structure check korchi
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

  // Jodi article na thake ba title na thake
  if (!article || !article.title) {
    return notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {article.category && (
                  <span className="bg-[#E53E3E] text-xs px-2 py-1 rounded">
                    {article.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                {article.title}
              </h1>

              {article.thumbnail && (
                <div className="mb-8 rounded-xl overflow-hidden border border-[#1E1E2E]">
                  <img 
                    src={article.thumbnail} 
                    alt={article.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Main Content Area */}
              <div 
                className="prose prose-invert max-w-none text-[#CBD5E1] text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
            </article>

            {/* Sidebar */}
            <aside>
              <h3 className="text-xl font-bold mb-4 border-l-4 border-[#E53E3E] pl-3">সম্পর্কিত সংবাদ</h3>
              <div className="space-y-4">
                {related.map((item: any) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="block group">
                    <h4 className="group-hover:text-[#E53E3E] transition-colors">{item.title}</h4>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}