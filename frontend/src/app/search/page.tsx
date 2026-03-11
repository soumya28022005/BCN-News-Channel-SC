'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const API = 'http://localhost:8000/api/v1';

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return `${Math.floor(hrs / 24)} দিন আগে`;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/articles?search=${encodeURIComponent(query)}&status=PUBLISHED&limit=20`);
        const data = await res.json();
        setResults(data.data || []);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F]">
        {/* Search Bar */}
        <div className="bg-[#111118] border-b border-[#1E1E2E] py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6 text-center" style={{ fontFamily: 'var(--font-playfair)' }}>
              সংবাদ খুঁজুন
            </h1>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="শিরোনাম বা বিষয় লিখুন..."
                className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded-lg px-5 py-4 pr-12 text-base focus:outline-none focus:border-[#E53E3E] transition-colors"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#E53E3E] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {!searched && !query && (
            <div className="text-center py-16">
              <p className="text-[#64748B]">কী খুঁজছেন লিখুন...</p>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#64748B]">"{query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি</p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="text-[#64748B] text-sm mb-6">"{query}" — {results.length}টি ফলাফল</p>
              <div className="space-y-4">
                {results.map((article: any) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="group flex gap-4 bg-[#111118] rounded-lg p-4 border border-[#1E1E2E] hover:border-[#E53E3E]/40 transition-colors">
                    <div className="w-24 h-20 shrink-0 bg-[#1E1E2E] rounded overflow-hidden">
                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs">BCN</div>
                      )}
                    </div>
                    <div className="flex-1">
                      {article.category && (
                        <span className="text-[#E53E3E] text-xs font-medium uppercase">{article.category.name}</span>
                      )}
                      <h3 className="text-sm font-semibold text-[#E2E8F0] group-hover:text-[#E53E3E] transition-colors leading-snug mt-1 mb-1">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-xs text-[#64748B] line-clamp-1">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-[#64748B] mt-2">
                        <span>{article.author?.name}</span>
                        <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}