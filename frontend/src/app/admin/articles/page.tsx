'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { api } from '../../../lib/api';
import { timeAgo } from '../../../lib/utils';
import { Edit, AlertCircle, CheckCircle, ExternalLink, Clock } from 'lucide-react';

// ─── Status badge config ────────────────────────────────────────────────────
// Maps every ArticleStatus value to a Bengali label + Tailwind colour classes.
// REVIEW = "সম্পাদকের অপেক্ষায়" — this is the state reporters land in after
// clicking "Send to Editor".
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

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (user) fetchArticles();
  }, [isAuthenticated, filter, user]);

  const fetchArticles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const currentUser = user as any;
      // Prisma Role enum: SUPER_ADMIN | ADMIN | JOURNALIST | EDITOR | USER
      const isReporter   = currentUser?.role === 'JOURNALIST';
      const currentUserId = currentUser?.id || currentUser?._id;

      // When filter is ALL we send no status param → backend returns all statuses.
      // This is key: a reporter clicking "সব" must see their REVIEW articles.
      const statusQuery = filter === 'ALL' ? '' : `&status=${filter}`;
      const authorQuery = isReporter ? `&authorId=${currentUserId}` : '';
      const timestamp   = new Date().getTime();

      const response = await api.get<any>(
        `/articles?limit=50${statusQuery}${authorQuery}&_t=${timestamp}`
      );
      let fetchedArticles = response.data || [];

      // Defensive client-side filter: even if backend sends extra rows,
      // reporters never see other people's work.
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

  // Tabs shown depend on role.
  // Reporters only care about ALL / REVIEW (their pending) / PUBLISHED.
  // Admins see DRAFT too.
  const tabs = isAdminOrEditor
    ? [
        { label: 'সব',                value: 'ALL' },
        { label: 'প্রকাশিত',          value: 'PUBLISHED' },
        { label: 'অপেক্ষায় (Review)', value: 'REVIEW' },
        { label: 'ড্রাফট',            value: 'DRAFT' },
      ]
    : [
        { label: 'সব',                value: 'ALL' },
        { label: 'অপেক্ষায়',          value: 'REVIEW' },
        { label: 'প্রকাশিত',          value: 'PUBLISHED' },
      ];

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">
              BCN
            </Link>
            <div>
              <h1 className="text-white font-bold text-sm">
                সব সংবাদ <span className="text-[#64748B] font-normal">({currentUser?.role})</span>
              </h1>
              <Link href="/admin" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← Dashboard</Link>
            </div>
          </div>
          <Link
            href="/admin/articles/create"
            className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
          >
            + নতুন সংবাদ
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded text-sm whitespace-nowrap transition-colors ${
                filter === tab.value
                  ? 'bg-[#E53E3E] text-white'
                  : 'bg-[#111118] text-[#64748B] border border-[#1E1E2E] hover:border-[#E53E3E]'
              }`}
            >
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
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-[#64748B]">লোড হচ্ছে...</td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-[#64748B]">কোনো সংবাদ নেই</td>
                  </tr>
                ) : (
                  articles.map((article: any) => {
                    const isAuthor = String(article.author?.id) === String(currentUserId);

                    /**
                     * Permission rules:
                     * - Admin/Editor → can always edit & delete any article
                     * - Reporter (JOURNALIST) → can edit & delete their OWN articles
                     *   at ANY status (REVIEW, PUBLISHED, DRAFT).
                     *   They cannot publish — only Admin/Editor can do that.
                     */
                    const canEditOrDelete = isAdminOrEditor || isAuthor;

                    /**
                     * Publish button:
                     * - Only Admin/Editor see it
                     * - Only shown when status is NOT already PUBLISHED
                     */
                    const canPublish = isAdminOrEditor && article.status !== 'PUBLISHED';

                    const statusCfg = STATUS_CONFIG[article.status] ?? {
                      label: article.status,
                      classes: 'bg-gray-500/10 text-gray-400',
                    };

                    return (
                      <tr key={article.id} className="hover:bg-[#1E1E2E]/30 transition-colors group">
                        {/* Title + meta */}
                        <td className="px-6 py-4">
                          <h4 className="text-sm text-[#E2E8F0] font-medium max-w-md truncate">
                            {article.title}
                          </h4>
                          <p className="text-[11px] text-[#64748B] mt-1">
                            {article.author?.name || 'Unknown'} •{' '}
                            {article.category?.name || 'Uncategorized'} •{' '}
                            {timeAgo(article.createdAt)}
                          </p>
                        </td>

                        {/* Status badge */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${statusCfg.classes}`}>
                            {article.status === 'REVIEW' && <Clock size={10} />}
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Publish — Admin/Editor only, for non-published articles */}
                            {canPublish && (
                              <button
                                onClick={() => handlePublish(article.id)}
                                className="p-1.5 text-green-500 hover:bg-green-500/10 rounded"
                                title="প্রকাশ করুন"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}

                            {/* View live — only makes sense when published */}
                            {article.status === 'PUBLISHED' && (
                              <Link
                                href={`/news/${article.slug}`}
                                className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded"
                                title="দেখুন"
                              >
                                <ExternalLink size={16} />
                              </Link>
                            )}

                            {/* Edit */}
                            {canEditOrDelete && (
                              <Link
                                href={`/admin/articles/edit/${article.id}`}
                                className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded"
                                title="সম্পাদনা"
                              >
                                <Edit size={16} />
                              </Link>
                            )}

                            {/* Delete */}
                            {canEditOrDelete && (
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"
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