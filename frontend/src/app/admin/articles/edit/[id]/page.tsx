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
        api.get<any>(`/articles/${articleId}`),
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

  const handleSave = async (publish = false) => {
    if (!form.title.trim()) { setMsg('❌ শিরোনাম দিন'); return; }
    setSaving(true); setMsg('');
    try {
      await api.patch(`/articles/${articleId}`, form);
      if (publish && currentStatus !== 'PUBLISHED') {
        await api.patch(`/articles/${articleId}/publish`);
      }
      setMsg(publish ? '✅ পাবলিশ হয়েছে!' : '✅ ড্রাফট সেভ হয়েছে!');
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">সংবাদ এডিট করুন</h1>
              <Link href="/admin/articles" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← সব সংবাদ</Link>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="bg-[#1E1E2E] text-white px-4 py-2 rounded text-sm hover:bg-[#2E2E3E] disabled:opacity-50 transition-colors">
              {saving ? 'সেভ হচ্ছে...' : 'ড্রাফট সেভ'}
            </button>
            {currentStatus !== 'PUBLISHED' && (
              <button onClick={() => handleSave(true)} disabled={saving}
                className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors">
                পাবলিশ করুন
              </button>
            )}
            {currentStatus === 'PUBLISHED' && (
              <button onClick={() => handleSave(false)} disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors">
                আপডেট করুন
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {msg && (
          <div className={`px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64748B]">স্ট্যাটাস:</span>
          <span className={`px-2 py-1 rounded font-bold uppercase ${currentStatus === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
            {currentStatus === 'PUBLISHED' ? 'Live' : 'Draft'}
          </span>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">ক্যাটাগরি</label>
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
              className="w-full bg-[#111118] text-white border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors">
              <option value="">ক্যাটাগরি বেছে নিন</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">থাম্বনেইল URL</label>
            <input value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}
              className="w-full bg-[#111118] text-white border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
              placeholder="https://..." />
          </div>
        </div>

        <div className="flex gap-6 p-4 bg-[#111118] border border-[#1E1E2E] rounded-lg">
          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer">
            <input type="checkbox" checked={form.isBreaking} onChange={e => setForm({...form, isBreaking: e.target.checked})}
              className="w-4 h-4 accent-[#E53E3E]" />
            🔴 ব্রেকিং নিউজ
          </label>
          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})}
              className="w-4 h-4 accent-[#E53E3E]" />
            ⭐ ফিচার্ড
          </label>
        </div>
      </div>
    </div>
  );
}
