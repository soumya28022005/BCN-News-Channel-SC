'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { api } from '../../../lib/api';
import { timeAgo } from '../../../lib/utils';

export default function AdminArticlesPage() {
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    fetchArticles();
  }, [isAuthenticated, filter]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const status = filter === 'ALL' ? '' : `&status=${filter}`;
      const data = await api.get<any>(`/articles?limit=50${status}`);
      setArticles(data.data || []);
    } catch { } finally { setLoading(false); }
  };

  const handlePublish = async (id: string) => {
    await api.patch(`/articles/${id}/publish`);
    fetchArticles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('সত্যিই মুছে ফেলবেন?')) return;
    await api.delete(`/articles/${id}`);
    fetchArticles();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">সব সংবাদ</h1>
              <Link href="/admin" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← Dashboard</Link>
            </div>
          </div>
          <Link href="/admin/articles/create" className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
            + নতুন সংবাদ
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6">
          {[
            { label: 'সব', value: 'ALL' },
            { label: 'প্রকাশিত', value: 'PUBLISHED' },
            { label: 'ড্রাফট', value: 'DRAFT' },
            { label: 'রিভিউ', value: 'REVIEW' },
          ].map((tab) => (
            <button key={tab.value} onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded text-sm transition-colors ${filter === tab.value ? 'bg-[#E53E3E] text-white' : 'bg-[#111118] text-[#64748B] hover:text-white border border-[#1E1E2E]'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-[#1E1E2E] text-xs text-[#64748B] uppercase tracking-wider">
            <div className="col-span-6">শিরোনাম</div>
            <div className="col-span-2">বিভাগ</div>
            <div className="col-span-2">স্ট্যাটাস</div>
            <div className="col-span-2">অ্যাকশন</div>
          </div>
          {loading ? (
            <div className="px-6 py-12 text-center text-[#64748B] text-sm">লোড হচ্ছে...</div>
          ) : articles.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#64748B] text-sm">কোনো সংবাদ নেই</div>
          ) : (
            <div className="divide-y divide-[#1E1E2E]">
              {articles.map((article: any) => (
                <div key={article.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#1E1E2E]/30 transition-colors">
                  <div className="col-span-6 min-w-0 pr-4">
                    <h4 className="text-sm text-[#E2E8F0] truncate">{article.title}</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {article.author?.name} • {timeAgo(article.publishedAt || article.createdAt)}
                      {article.isBreaking && <span className="ml-2 text-[#E53E3E]">● ব্রেকিং</span>}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-[#94A3B8]">{article.category?.name || '—'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${
                      article.status === 'PUBLISHED' ? 'bg-[#16A34A]/20 text-[#16A34A]'
                      : article.status === 'DRAFT' ? 'bg-[#D97706]/20 text-[#D97706]'
                      : 'bg-[#64748B]/20 text-[#64748B]'}`}>
                      {article.status === 'PUBLISHED' ? 'প্রকাশিত' : article.status === 'DRAFT' ? 'ড্রাফট' : article.status}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    {article.status !== 'PUBLISHED' && (
                      <button onClick={() => handlePublish(article.id)} className="text-[#16A34A] text-xs hover:underline">Publish</button>
                    )}
                    <Link href={`/news/${article.slug}`} className="text-[#64748B] text-xs hover:text-white transition-colors">দেখুন</Link>
                    <button onClick={() => handleDelete(article.id)} className="text-[#E53E3E] text-xs hover:underline">মুছুন</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}