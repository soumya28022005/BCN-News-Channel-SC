'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import { timeAgo } from '../../lib/utils';

export default function AdminDashboard() {
  const { user, isAuthenticated, loadFromStorage, logout } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ articles: 0, published: 0, draft: 0, users: 0 });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [allRes, publishedRes, draftRes] = await Promise.all([
        api.get<any>('/articles?limit=5'),
        api.get<any>('/articles?status=PUBLISHED&limit=1'),
        api.get<any>('/articles?status=DRAFT&limit=1'),
      ]);
      setStats({
        articles: allRes.pagination?.total || 0,
        published: publishedRes.pagination?.total || 0,
        draft: draftRes.pagination?.total || 0,
        users: 0,
      });
      setRecentArticles(allRes.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  const handlePublish = async (id: string) => {
    await api.patch(`/articles/${id}/publish`);
    fetchDashboardData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('সত্যিই মুছে ফেলবেন?')) return;
    await api.delete(`/articles/${id}`);
    fetchDashboardData();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Admin Header */}
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">
              BCN
            </Link>
            <div>
              <h1 className="text-white font-bold text-sm">Admin Panel</h1>
              <p className="text-[#64748B] text-xs">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#64748B] hover:text-white text-xs transition-colors">
              সাইট দেখুন
            </Link>
            <button
              onClick={logout}
              className="bg-[#1E1E2E] text-[#64748B] hover:text-white px-3 py-1.5 rounded text-xs transition-colors"
            >
              লগআউট
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            স্বাগতম, {user?.name}! 👋
          </h2>
          <p className="text-[#64748B] text-sm mt-1">BCN Admin Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'মোট সংবাদ', value: stats.articles, icon: '📰', color: '#3182CE' },
            { label: 'প্রকাশিত', value: stats.published, icon: '✅', color: '#16A34A' },
            { label: 'ড্রাফট', value: stats.draft, icon: '📝', color: '#D97706' },
            { label: 'ব্যবহারকারী', value: stats.users || '—', icon: '👥', color: '#7C3AED' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-2xl font-bold text-white">{loading ? '...' : stat.value}</span>
              </div>
              <p className="text-[#64748B] text-xs uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'নতুন সংবাদ', href: '/admin/articles/create', icon: '✏️', bg: 'bg-[#E53E3E]' },
            { label: 'সব সংবাদ', href: '/admin/articles', icon: '📋', bg: 'bg-[#1E1E2E]' },
            { label: 'ব্যবহারকারী', href: '/admin/users', icon: '👥', bg: 'bg-[#1E1E2E]' },
            { label: 'সেটিংস', href: '/admin/settings', icon: '⚙️', bg: 'bg-[#1E1E2E]' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.bg} rounded-lg p-4 flex items-center gap-3 hover:opacity-80 transition-opacity`}
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-white text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Articles */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E]">
            <h3 className="text-white font-bold">সাম্প্রতিক সংবাদ</h3>
            <Link href="/admin/articles" className="text-[#E53E3E] text-xs hover:underline">সব দেখুন</Link>
          </div>
          <div className="divide-y divide-[#1E1E2E]">
            {loading ? (
              <div className="px-6 py-8 text-center text-[#64748B] text-sm">লোড হচ্ছে...</div>
            ) : recentArticles.length === 0 ? (
              <div className="px-6 py-8 text-center text-[#64748B] text-sm">কোনো সংবাদ নেই</div>
            ) : (
              recentArticles.map((article: any) => (
                <div key={article.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-[#E2E8F0] truncate">{article.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                      <span>{article.author?.name}</span>
                      <span>•</span>
                      <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
                      <span className={`px-2 py-0.5 rounded uppercase font-medium ${
                        article.status === 'PUBLISHED'
                          ? 'bg-[#16A34A]/20 text-[#16A34A]'
                          : article.status === 'DRAFT'
                          ? 'bg-[#D97706]/20 text-[#D97706]'
                          : 'bg-[#64748B]/20 text-[#64748B]'
                      }`}>
                        {article.status === 'PUBLISHED' ? 'প্রকাশিত' : article.status === 'DRAFT' ? 'ড্রাফট' : article.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {article.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handlePublish(article.id)}
                        className="bg-[#16A34A]/20 text-[#16A34A] px-3 py-1 rounded text-xs hover:bg-[#16A34A]/40 transition-colors"
                      >
                        Publish
                      </button>
                    )}
                    <Link
                      href={`/news/${article.slug}`}
                      className="bg-[#1E1E2E] text-[#64748B] px-3 py-1 rounded text-xs hover:text-white transition-colors"
                    >
                      দেখুন
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="bg-[#E53E3E]/20 text-[#E53E3E] px-3 py-1 rounded text-xs hover:bg-[#E53E3E]/40 transition-colors"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}