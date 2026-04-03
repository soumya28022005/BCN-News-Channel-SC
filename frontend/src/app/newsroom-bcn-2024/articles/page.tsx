'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { api } from '../../../lib/api';
import { timeAgo } from '../../../lib/utils';
import { Edit, AlertCircle, CheckCircle, ExternalLink, Clock } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PUBLISHED: { label: 'প্রকাশিত',              classes: 'bg-green-500/10 text-green-400' },
  DRAFT:     { label: 'ড্রাফট',                classes: 'bg-yellow-500/10 text-yellow-400' },
  REVIEW:    { label: 'সম্পাদকের অপেক্ষায়',  classes: 'bg-blue-500/10 text-blue-400' },
  SCHEDULED: { label: 'নির্ধারিত',            classes: 'bg-purple-500/10 text-purple-400' },
  ARCHIVED:  { label: 'আর্কাইভড',             classes: 'bg-gray-500/10 text-gray-400' },
};

export default function AdminArticlesPage() {
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (user) fetchArticles();
  }, [isAuthenticated, filter, user, router]);

  const fetchArticles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const currentUser = user as any;
      const isReporter   = currentUser?.role === 'JOURNALIST';
      const currentUserId = currentUser?.id || currentUser?._id;

      const statusQuery = filter === 'ALL' ? '' : `&status=${filter}`;
      const authorQuery = isReporter ? `&authorId=${currentUserId}` : '';
      const timestamp   = new Date().getTime();

      const response = await api.get<any>(
        `/articles?limit=50${statusQuery}${authorQuery}&_t=${timestamp}`
      );
      let fetchedArticles = response.data || [];

      if (isReporter) {
        fetchedArticles = fetchedArticles.filter((article: any) =>
          String(article.author?.id) === String(currentUserId)
        );
      }

      setArticles(fetchedArticles);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm('নিউজটি পাবলিশ করতে চান?')) return;
    try {
      await api.patch(`/articles/${id}/publish`);
      fetchArticles();
    } catch (err) { alert('পাবলিশ করা যায়নি'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('সত্যিই মুছে ফেলবেন?')) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) { alert('ডিলিট করা যায়নি'); }
  };

  if (!isAuthenticated) return null;

  const currentUser    = user as any;
  const currentUserId  = currentUser?.id || currentUser?._id;
  const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(currentUser?.role || '');

  const tabs = isAdminOrEditor
    ? [
        { label: 'সব',                value: 'ALL' },
        { label: 'প্রকাশিত',          value: 'PUBLISHED' },
        { label: 'অপেক্ষায় (Review)', value: 'REVIEW' },
        { label: 'ড্রাফট',            value: 'DRAFT' },
      ]
    : [
        { label: 'সব',                value: 'ALL' },
        { label: 'ড্রাফট',            value: 'DRAFT' },
        { label: 'অপেক্ষায়',          value: 'REVIEW' },
        { label: 'প্রকাশিত',          value: 'PUBLISHED' },
      ];

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* 🔹 FIX: Standardized Sticky Header to match Create/Edit/Settings pages */}
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 🔹 FIX: Logo points to the correct dashboard */}
            <Link href="/newsroom-bcn-2024" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">
              BCN
            </Link>
            <div>
              <h1 className="text-white font-bold text-sm">
                সব সংবাদ <span className="text-[#64748B] font-normal">({currentUser?.role})</span>
              </h1>
              {/* 🔹 FIX: Dynamic history back logic */}
              <span onClick={() => router.back()} className="text-[#64748B] text-xs hover:text-[#E53E3E] cursor-pointer select-none transition-colors">
                ← ফিরে যান
              </span>
            </div>
          </div>
          {/* 🔹 FIX: Corrected the path to Create Article */}
          <Link
            href="/newsroom-bcn-2024/articles/create"
            className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/20"
          >
            + নতুন সংবাদ
          </Link>
        </div>
      </header>

      {/* 🔹 FIX: Changed max-w-7xl to max-w-5xl to match UI consistency */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-5 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all font-medium ${
                filter === tab.value
                  ? 'bg-[#E53E3E] text-white shadow-lg shadow-red-500/20'
                  : 'bg-[#111118] text-[#64748B] border border-[#1E1E2E] hover:border-[#E53E3E] hover:text-[#E2E8F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#0A0A0F] border-b border-[#1E1E2E] text-[#64748B] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">শিরোনাম</th>
                  <th className="px-6 py-4 font-bold text-center">স্ট্যাটাস</th>
                  <th className="px-6 py-4 font-bold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E]">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-[#64748B] font-medium">লোড হচ্ছে...</td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-[#64748B] font-medium">কোনো সংবাদ নেই</td>
                  </tr>
                ) : (
                  articles.map((article: any) => {
                    const isAuthor = String(article.author?.id) === String(currentUserId);
                    const canEditOrDelete = isAdminOrEditor || isAuthor;
                    const canPublish = isAdminOrEditor && article.status !== 'PUBLISHED';

                    const statusCfg = STATUS_CONFIG[article.status] ?? {
                      label: article.status,
                      classes: 'bg-gray-500/10 text-gray-400',
                    };

                    return (
                      <tr key={article.id} className="hover:bg-[#1E1E2E]/40 transition-colors group">
                        <td className="px-6 py-4">
                          <h4 className="text-sm text-[#E2E8F0] font-bold max-w-md truncate group-hover:text-white transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-[11px] text-[#64748B] mt-1.5 font-medium">
                            <span className="text-[#94A3B8]">{article.author?.name || 'Unknown'}</span> •{' '}
                            {article.category?.name || 'Uncategorized'} •{' '}
                            {timeAgo(article.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusCfg.classes}`}>
                            {article.status === 'REVIEW' && <Clock size={12} />}
                            {statusCfg.label}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {canPublish && (
                              <button
                                onClick={() => handlePublish(article.id)}
                                className="p-2 text-green-500 bg-green-500/5 hover:bg-green-500/20 rounded-lg transition-colors"
                                title="প্রকাশ করুন"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}

                            {article.status === 'PUBLISHED' && (
                              <Link
                                href={`/news/${article.slug}`}
                                className="p-2 text-blue-500 bg-blue-500/5 hover:bg-blue-500/20 rounded-lg transition-colors"
                                title="দেখুন"
                              >
                                <ExternalLink size={16} />
                              </Link>
                            )}

                            {canEditOrDelete && (
                              <Link
                                /* 🔹 FIX: Corrected path for Edit Article */
                                href={`/newsroom-bcn-2024/articles/edit/${article.id}`}
                                className="p-2 text-indigo-400 bg-indigo-400/5 hover:bg-indigo-400/20 rounded-lg transition-colors"
                                title="সম্পাদনা"
                              >
                                <Edit size={16} />
                              </Link>
                            )}

                            {canEditOrDelete && (
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="p-2 text-red-500 bg-red-500/5 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="মুছুন"
                              >
                                <AlertCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}