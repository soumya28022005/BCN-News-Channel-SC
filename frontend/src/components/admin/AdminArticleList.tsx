'use client';
import Link from 'next/link';
import { timeAgo } from '../../lib/utils';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/auth.store'; // Auth store import kora holo

interface AdminArticleListProps {
  articles: any[];
  onRefresh: () => void;
}

export default function AdminArticleList({ articles, onRefresh }: AdminArticleListProps) {
  const { user } = useAuthStore(); // Current logged-in user check korar jonno

  const handlePublish = async (id: string) => {
    await api.patch(`/articles/${id}/publish`);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('সত্যিই মুছে ফেলবেন?')) return;
    await api.delete(`/articles/${id}`);
    onRefresh();
  };

  // User permission check korar logic (Journalist hole shudhu nijer post edit korte parbe, Admin/Editor sob parbe)
  const canEditOrDelete = (articleAuthorId: string) => {
    if (!user) return false;
    if (user.role === 'ADMIN' || user.role === 'EDITOR') return true;
    return user.id === articleAuthorId;
  };

  return (
    <div className="divide-y divide-[#1E1E2E]">
      {articles.map((article: any) => (
        <div key={article.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#1E1E2E]/30 transition-colors">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm text-[#E2E8F0] truncate">{article.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
              <span>{article.author?.name}</span>
              <span>•</span>
              <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
              <span className={`px-2 py-0.5 rounded uppercase font-medium ${
                article.status === 'PUBLISHED' ? 'bg-[#16A34A]/20 text-[#16A34A]'
                : article.status === 'DRAFT' ? 'bg-[#D97706]/20 text-[#D97706]'
                : 'bg-[#64748B]/20 text-[#64748B]'
              }`}>
                {article.status === 'PUBLISHED' ? 'প্রকাশিত' : article.status === 'DRAFT' ? 'ড্রাফট' : article.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {article.status !== 'PUBLISHED' && canEditOrDelete(article.authorId) && (
              <button onClick={() => handlePublish(article.id)} className="text-[#16A34A] text-xs hover:underline">Publish</button>
            )}
            
            <Link href={`/news/${article.slug}`} className="text-[#64748B] text-xs hover:text-white transition-colors">দেখুন</Link>
            
            {/* Notun Edit Button */}
            {canEditOrDelete(article.authorId) && (
              <Link href={`/admin/articles/edit/${article.id}`} className="text-[#3B82F6] text-xs hover:underline">
                সম্পাদনা
              </Link>
            )}

            {canEditOrDelete(article.authorId) && (
              <button onClick={() => handleDelete(article.id)} className="text-[#E53E3E] text-xs hover:underline">মুছুন</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}