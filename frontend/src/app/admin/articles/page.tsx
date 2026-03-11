'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { api } from '../../../lib/api';
import { timeAgo } from '../../../lib/utils';
import { Edit, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export default function AdminArticlesPage() {
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (user) fetchArticles(); 
  }, [isAuthenticated, filter, user]);

  const fetchArticles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const status = filter === 'ALL' ? '' : `&status=${filter}`;
      
      // 🔹 ফিক্সড লজিক: এখানে Backticks (`) ব্যবহার করতে হবে, সিঙ্গল কোট নয়!
      const isJournalist = user.role === 'JOURNALIST';
      const authorFilter = isJournalist ? `&authorId=${user.id}` : '';
      
      const timestamp = new Date().getTime();
      const data = await api.get<any>(`/articles?limit=50${status}${authorFilter}&_t=${timestamp}`);
      setArticles(data.data || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm('নিউজটি পাবলিশ করতে চান?')) return;
    try {
      await api.patch(`/articles/${id}/publish`);
      fetchArticles();
    } catch(err) { alert('পাবলিশ করা যায়নি'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('সত্যিই মুছে ফেলবেন?')) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchArticles();
    } catch(err) { alert('ডিলিট করা যায়নি'); }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">সব সংবাদ ({user?.role})</h1>
              <Link href="/admin" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← Dashboard</Link>
            </div>
          </div>
          <Link href="/admin/articles/create" className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
            + নতুন সংবাদ
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { label: 'সব', value: 'ALL' },
            { label: 'প্রকাশিত', value: 'PUBLISHED' },
            { label: 'ড্রাফট', value: 'DRAFT' },
          ].map((tab) => (
            <button key={tab.value} onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded text-sm whitespace-nowrap transition-colors ${filter === tab.value ? 'bg-[#E53E3E] text-white' : 'bg-[#111118] text-[#64748B] border border-[#1E1E2E]'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#0A0A0F] border-b border-[#1E1E2E] text-[#64748B] text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">শিরোনাম</th>
                  <th className="px-6 py-4 font-semibold text-center">স্ট্যাটাস</th>
                  <th className="px-6 py-4 font-semibold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E]">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-[#64748B]">লোড হচ্ছে...</td></tr>
                ) : articles.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-[#64748B]">কোনো সংবাদ নেই</td></tr>
                ) : (
                  articles.map((article: any) => {
                    const isAuthor = article.author?.id === user?.id;
                    const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(user?.role || '');
                    const canEditOrDelete = isAuthor || isAdminOrEditor;

                    return (
                      <tr key={article.id} className="hover:bg-[#1E1E2E]/30 transition-colors group">
                        <td className="px-6 py-4">
                          <h4 className="text-sm text-[#E2E8F0] font-medium max-w-md truncate">{article.title}</h4>
                          <p className="text-[11px] text-[#64748B] mt-1">
                            {article.author?.name} • {article.category?.name || 'Uncategorized'} • {timeAgo(article.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            article.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500'
                            : article.status === 'DRAFT' ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-blue-500/10 text-blue-500'}`}>
                            {article.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {article.status !== 'PUBLISHED' && (isAdminOrEditor || isAuthor) && (
                              <button onClick={() => handlePublish(article.id)} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded" title="Publish">
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <Link href={`/news/${article.slug}`} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded" title="View">
                              <ExternalLink size={16} />
                            </Link>
                            {canEditOrDelete && (
                              <Link href={`/admin/articles/edit/${article.id}`} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded" title="Edit">
                                <Edit size={16} />
                              </Link>
                            )}
                            {canEditOrDelete && (
                              <button onClick={() => handleDelete(article.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded" title="Delete">
                                <AlertCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
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