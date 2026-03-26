'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../../../store/auth.store';
import { api } from '../../../../../lib/api';
import ArticleEditor from '../../../../../components/admin/ArticleEditor';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();
  const articleId = params?.id as string;

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', categoryId: '',
    isBreaking: false, isFeatured: false, thumbnail: '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (articleId) fetchData();
  }, [isAuthenticated, articleId]);

  const fetchData = async () => {
    try {
      const [artRes, catRes] = await Promise.all([
        api.get<any>(`/articles/id/${articleId}`),
        api.get<any>('/categories'),
      ]);
      const a = artRes.article || artRes;
      setCurrentStatus(a.status || '');
      setForm({
        title: a.title || '',
        excerpt: a.excerpt || '',
        content: a.content || '',
        categoryId: a.categoryId || '',
        isBreaking: a.isBreaking || false,
        isFeatured: a.isFeatured || false,
        thumbnail: a.thumbnail || '',
      });
      setCategories(catRes.data || catRes || []);
    } catch {
      setMsg('❌ আর্টিকেল লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  const currentUser = user as any;
  const isReporter = currentUser?.role === 'JOURNALIST';
  const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(currentUser?.role || '');

  const handleSave = async (action: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UPDATE') => {
    if (!form.title.trim()) { setMsg('❌ শিরোনাম দিন'); return; }
    setSaving(true); setMsg('');
    try {
      let newStatus = currentStatus;
      if (action === 'DRAFT') newStatus = 'DRAFT';
      if (action === 'REVIEW') newStatus = 'REVIEW';

      await api.patch(`/articles/${articleId}`, { ...form, status: newStatus });

      if (action === 'PUBLISHED') {
        await api.patch(`/articles/${articleId}/publish`);
      }

      const messages: Record<string, string> = {
        DRAFT:     '✅ ড্রাফট সেভ হয়েছে!',
        REVIEW:    '📤 সম্পাদকের কাছে পাঠানো হয়েছে!',
        PUBLISHED: '🚀 প্রকাশিত হয়েছে!',
        UPDATE:    '✅ আপডেট হয়েছে!',
      };
      setMsg(messages[action]);
      setTimeout(() => router.push('/admin/articles'), 1500);
    } catch {
      setMsg('❌ সেভ করা যায়নি');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-8 h-8 border-2 border-[#E53E3E] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        লোড হচ্ছে...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">সংবাদ এডিট করুন</h1>
              <Link href="/admin/articles" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← সব সংবাদ</Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* স্ট্যাটাস badge */}
            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase mr-2 ${
              currentStatus === 'PUBLISHED' ? 'bg-green-500/10 text-green-400'
              : currentStatus === 'REVIEW' ? 'bg-blue-500/10 text-blue-400'
              : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {currentStatus === 'PUBLISHED' ? 'প্রকাশিত' : currentStatus === 'REVIEW' ? 'অপেক্ষায়' : 'ড্রাফট'}
            </span>

            {/* Reporter buttons */}
            {isReporter && (
              <>
                <button onClick={() => handleSave('DRAFT')} disabled={saving}
                  className="bg-[#1E1E2E] text-[#94A3B8] px-4 py-2 rounded text-sm hover:bg-[#2E2E3E] border border-[#2E2E3E] disabled:opacity-50">
                  {saving ? '...' : '💾 ড্রাফট সেভ'}
                </button>
                <button onClick={() => handleSave('REVIEW')} disabled={saving}
                  className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50">
                  {saving ? '...' : '📤 সম্পাদকের কাছে পাঠান'}
                </button>
              </>
            )}

            {/* Admin/Editor buttons */}
            {isAdminOrEditor && (
              <>
                <button onClick={() => handleSave('DRAFT')} disabled={saving}
                  className="bg-[#1E1E2E] text-[#E2E8F0] px-4 py-2 rounded text-sm hover:bg-[#2E2E3E] border border-[#2E2E3E] disabled:opacity-50">
                  {saving ? '...' : '💾 ড্রাফট'}
                </button>
                {currentStatus !== 'PUBLISHED' && (
                  <button onClick={() => handleSave('PUBLISHED')} disabled={saving}
                    className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50">
                    {saving ? '...' : '🚀 প্রকাশ করুন'}
                  </button>
                )}
                {currentStatus === 'PUBLISHED' && (
                  <button onClick={() => handleSave('UPDATE')} disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50">
                    {saving ? '...' : '✅ আপডেট করুন'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {msg && (
          <div className={`px-4 py-3 rounded text-sm mb-6 ${msg.startsWith('✅') || msg.startsWith('🚀') || msg.startsWith('📤') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg}
          </div>
        )}

        {isReporter && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-3 rounded mb-6">
            ℹ️ <strong>ড্রাফট সেভ</strong> — শুধু আপনি দেখবেন। <strong>সম্পাদকের কাছে পাঠান</strong> — অনুমোদন করলে প্রকাশ হবে।
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">শিরোনাম *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-[#111118] text-white border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
                placeholder="সংবাদের শিরোনাম লিখুন" />
            </div>
            <div>
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">সারসংক্ষেপ</label>
              <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})}
                rows={3} className="w-full bg-[#111118] text-white border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] resize-none transition-colors"
                placeholder="সংক্ষিপ্ত বিবরণ..." />
            </div>
            <div>
              <ArticleEditor value={form.content} onChange={(val) => setForm({...form, content: val})} />
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-3">থাম্বনেইল URL</label>
              <input value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}
                className="w-full bg-[#1E1E2E] text-white border border-[#2E2E3E] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E]"
                placeholder="https://..." />
              {form.thumbnail && (
                <img src={form.thumbnail} alt="preview" className="mt-3 w-full h-32 object-cover rounded" />
              )}
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-3">ক্যাটাগরি</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
                className="w-full bg-[#1E1E2E] text-white border border-[#2E2E3E] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E]">
                <option value="">ক্যাটাগরি বেছে নিন</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {isAdminOrEditor && (
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4 space-y-3">
                <label className="text-[#64748B] text-xs uppercase tracking-wider block">অপশন</label>
                {[
                  { label: '🔴 ব্রেকিং নিউজ', key: 'isBreaking' },
                  { label: '⭐ ফিচার্ড', key: 'isFeatured' },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setForm({...form, [opt.key]: !form[opt.key as keyof typeof form]})}
                      className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${form[opt.key as keyof typeof form] ? 'bg-[#E53E3E]' : 'bg-[#1E1E2E]'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${form[opt.key as keyof typeof form] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-[#E2E8F0] text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
