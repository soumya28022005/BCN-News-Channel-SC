'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../../../store/authStore';
import { api } from '../../../../../lib/api';
import ArticleEditor from '../../../../../components/admin/ArticleEditor';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loadFromStorage, logout } = useAuthStore();
  const articleId = params?.id as string;

  const [form, setForm] = useState({
    title: '', 
    excerpt: '', 
    content: '', 
    categoryId: '',
    isBreaking: false, 
    isFeatured: false, 
    thumbnail: '',
    source: '', // 🔹 Added source field
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  // 🔹 1. SECURE NAVIGATION & 5-MINUTE AUTO-LOGOUT 🔹
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { 
      router.push('/api/v1/auth/s/o/n/a/m/o/u/l/i/u/m/y/a'); 
      return; 
    }
    
    if (articleId) fetchData();

    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => logout(), 300000); // 5 mins
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, articleId, router, logout]);

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
        source: a.source || '', // 🔹 Populating source link
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
      setTimeout(() => router.push('/newsroom-bcn-2024/articles'), 1500);
    } catch {
      setMsg('❌ সেভ করা যায়নি');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white">লোড হচ্ছে...</div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/newsroom-bcn-2024" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">সংবাদ এডিট করুন</h1>
              <Link href="/newsroom-bcn-2024/articles" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← সব সংবাদ</Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase mr-2 ${
              currentStatus === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {currentStatus === 'PUBLISHED' ? 'প্রকাশিত' : 'ড্রাফট'}
            </span>

            {isReporter ? (
              <button onClick={() => handleSave('REVIEW')} disabled={saving} className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm disabled:opacity-50">
                {saving ? '...' : '📤 পাঠান'}
              </button>
            ) : (
              <button onClick={() => handleSave('UPDATE')} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50">
                {saving ? '...' : '✅ আপডেট করুন'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {msg && (
          <div className={`px-4 py-3 rounded text-sm mb-6 ${msg.includes('✅') || msg.includes('🚀') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-[#111118] text-white border border-[#1E1E2E] rounded px-4 py-3 outline-none focus:border-[#E53E3E]" placeholder="শিরোনাম *" />
            <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} className="w-full bg-[#111118] text-white border border-[#1E1E2E] rounded px-4 py-3 text-sm resize-none outline-none focus:border-[#E53E3E]" placeholder="সংক্ষিপ্ত বিবরণ..." />
            <ArticleEditor value={form.content} onChange={(val) => setForm({...form, content: val})} />
          </div>

          <div className="space-y-5">
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase block mb-3 font-bold">থাম্বনেইল URL</label>
              <input value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} className="w-full bg-[#1E1E2E] text-white border border-[#2E2E3E] rounded px-3 py-2 text-sm outline-none focus:border-[#E53E3E]" />
              {form.thumbnail && <img src={form.thumbnail} className="mt-3 w-full h-32 object-cover rounded" />}
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase block mb-3 font-bold">বিভাগ</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full bg-[#1E1E2E] text-white border border-[#2E2E3E] rounded px-3 py-2 text-sm outline-none focus:border-[#E53E3E]">
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* 🔹 SOURCE LINK INPUT 🔹 */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase block mb-3 font-bold tracking-wider">সোর্স / বিস্তারিত লিঙ্ক</label>
              <input 
                type="url" 
                value={form.source} 
                onChange={(e) => setForm({ ...form, source: e.target.value })} 
                placeholder="https://..." 
                className="w-full bg-[#1E1E2E] text-[#E2E8F0] border border-[#2E2E3E] rounded px-3 py-2 text-sm outline-none focus:border-[#E53E3E]" 
              />
              <p className="text-[10px] text-[#64748B] mt-2 italic">এখানে লিঙ্ক দিলে আর্টিকেলের শেষে "Read More" বাটন আসবে।</p>
            </div>

            {isAdminOrEditor && (
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4 space-y-3">
                <label className="text-[#64748B] text-xs uppercase tracking-wider block">অপশন</label>
                {[
                  { label: '🔴 ব্রেকিং নিউজ', key: 'isBreaking' },
                  { label: '⭐ ফিচার্ড', key: 'isFeatured' },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setForm({...form, [opt.key]: !form[opt.key as keyof typeof form]})} className={`w-10 h-5 rounded-full transition-colors ${form[opt.key as keyof typeof form] ? 'bg-[#E53E3E]' : 'bg-[#1E1E2E]'}`}>
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