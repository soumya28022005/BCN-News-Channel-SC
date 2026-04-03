import Link from 'next/link';
import Image from 'next/image';

import { apiUrl } from '../../lib/config'; // ✅ FIX 1: no more hardcoded localhost

async function getTrending() {
  try {
    // ✅ FIX 1: uses apiUrl() from config
    const res = await fetch(apiUrl('/articles/trending'), {
      next: { revalidate: 120 },
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return `${Math.floor(hrs / 24)} দিন আগে`;
}

export default async function TrendingPage() {
  const articles = await getTrending();

  return (
    <>
     
      <main className="min-h-screen bg-[#0A0A0F]">
        {/* Page Header */}
        <div className="bg-[#111118] border-b border-[#1E1E2E] py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-xs text-[#64748B] mb-4">
              <Link href="/" className="hover:text-[#E53E3E]">
                হোম
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#E2E8F0]">ট্রেন্ডিং</span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 bg-[#E53E3E] rounded" />
              <div>
                <h1
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  🔥 ট্রেন্ডিং সংবাদ
                </h1>
                <p className="text-[#64748B] text-sm mt-1">সবচেয়ে বেশি পড়া সংবাদ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#64748B] text-lg">কোনো ট্রেন্ডিং সংবাদ নেই</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article: any, i: number) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group flex gap-6 bg-[#111118] rounded-lg p-4 border border-[#1E1E2E] hover:border-[#E53E3E]/40 transition-colors article-card"
                >
                  <span className="text-4xl font-bold text-[#1E1E2E] group-hover:text-[#E53E3E] transition-colors font-mono w-12 shrink-0 leading-none mt-2">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* ✅ FIX 2: next/image with fill + relative container */}
                  <div className="w-32 h-24 shrink-0 bg-[#1E1E2E] rounded overflow-hidden relative">
                    {article.thumbnail ? (
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        sizes="128px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs">
                        BCN
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {article.category && (
                      <span className="text-[#E53E3E] text-xs font-medium uppercase">
                        {article.category.name}
                      </span>
                    )}
                    <h2 className="text-base font-semibold text-[#E2E8F0] group-hover:text-[#E53E3E] transition-colors leading-snug mt-1 mb-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-xs text-[#64748B] line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-[#64748B]">
                      <span>{article.author?.name}</span>
                      <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
                      <span>👁 {Number(article.viewCount).toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}