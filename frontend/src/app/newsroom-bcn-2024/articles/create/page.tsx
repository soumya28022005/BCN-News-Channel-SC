'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Update path to your authStore if necessary
import { useAuthStore } from '../../../../store/authStore';
import { api } from '../../../../lib/api';
import ArticleEditor from '../../../../components/admin/ArticleEditor';

export default function CreateArticlePage() {
  const { user, isAuthenticated, loadFromStorage, logout } = useAuthStore();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', categoryId: '',
    isBreaking: false, isFeatured: false,
    source: '', // 🔹 CHANGE 1: Added source to initial state
  });
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🔹 1. LOAD DRAFTS & AUTH ON MOUNT 🔹
  useEffect(() => { 
    loadFromStorage(); 
    
    // Check if there is an unsaved draft in local storage
    const savedDraft = localStorage.getItem('bcn_auto_draft');
    if (savedDraft) {
      try {
        setForm(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Failed to parse draft");
      }
    }
  }, [loadFromStorage]);

  // 🔹 2. AUTO-SAVE DRAFT AS YOU TYPE 🔹
  useEffect(() => {
    // Save to local storage every time the form changes
    if (form.title || form.content || form.excerpt || form.source) {
      localStorage.setItem('bcn_auto_draft', JSON.stringify(form));
    }
  }, [form]);

  // 🔹 3. 5-MINUTE INACTIVITY AUTO-LOGOUT 🔹
  useEffect(() => {
    if (!isAuthenticated) { 
      // If not authenticated, kick to secret URL
      router.push('/api/v1/auth/s/o/n/a/m/o/u/l/i/u/m/y/a'); 
      return; 
    }
    
    fetchCategories();

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 300,000 ms = exactly 5 minutes of doing absolutely nothing
      timeoutId = setTimeout(() => {
        logout(); // Automatically logs out and routes back to secret URL
      }, 300000);
    };

    // If the user types, clicks, or moves the mouse, the 5 min timer restarts
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    resetTimer(); // Start the timer

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, router, logout]);

  const fetchCategories = async () => {
    try {
      const data = await api.get<any>('/categories');
      setCategories(data.data || []);
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (targetStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => {
    if (!form.title || !form.content || !form.categoryId) {
      setError('শিরোনাম, বিষয়বস্তু ও বিভাগ আবশ্যক');
      return;
    }
    setError('');
    setLoading(true);

    try {
      let thumbnailUrl = '';
      if (thumbnail) {
        const formData = new FormData();
        formData.append('file', thumbnail);
        const uploadRes = await api.upload<any>('/media', formData);
        thumbnailUrl = uploadRes.data?.url || '';
      }

      const currentUser = user as any;
      const isReporter = currentUser?.role === 'JOURNALIST';

      const finalStatus = isReporter
        ? (targetStatus === 'DRAFT' ? 'DRAFT' : 'REVIEW')
        : targetStatus;

      const articleData: any = {
        ...form,
        status: finalStatus,
        // authorId always from the logged-in user (server also overrides from JWT)
        authorId: currentUser?.id || currentUser?._id,
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      };

      const res = await api.post<any>('/articles', articleData);

      if (res.success && res.data?.id) {
        if (finalStatus === 'PUBLISHED') {
          try {
            await api.patch(`/articles/${res.data.id}/publish`);
          } catch (e) {
            console.error('Publish patch error:', e);
          }
        }

        // 🔹 SUCCESS: Clear the local storage draft because it's safely saved to DB
        localStorage.removeItem('bcn_auto_draft');

        const messages: Record<string, string> = {
          DRAFT:     '📝 ড্রাফট সংরক্ষিত! শুধু আপনি দেখতে পাবেন।',
          REVIEW:    '📤 সম্পাদকের কাছে পাঠানো হয়েছে! অনুমোদনের অপেক্ষায়।',
          PUBLISHED: '✅ সংবাদ প্রকাশিত হয়েছে!',
        };
        setSuccess(messages[finalStatus]);

        setTimeout(() => router.push('/newsroom-bcn-2024/articles'), 1800);
      } else {
        setError(res.message || 'সংবাদ তৈরি করা যায়নি');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('কিছু একটা সমস্যা হয়েছে। কনসোল চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const currentUser = user as any;
  const isReporter = currentUser?.role === 'JOURNALIST';

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/newsroom-bcn-2024" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">
              BCN
            </Link>
            <div>
              <h1 className="text-white font-bold text-sm">নতুন সংবাদ</h1>
              <Link href="/newsroom-bcn-2024/articles" className="text-[#64748B] text-xs hover:text-[#E53E3E]">
                ← সব সংবাদ
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isReporter && (
              <>
                {/* DRAFT: শুধু reporter নিজে দেখবে */}
                <button
                  onClick={() => handleSubmit('DRAFT')}
                  disabled={loading}
                  className="bg-[#1E1E2E] text-[#94A3B8] px-4 py-2 rounded text-sm hover:bg-[#2E2E3E] border border-[#2E2E3E] transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : '💾 ড্রাফট সংরক্ষণ'}
                </button>

                {/* REVIEW: সম্পাদকের কাছে পাঠানো */}
                <button
                  onClick={() => handleSubmit('REVIEW')}
                  disabled={loading}
                  className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'পাঠানো হচ্ছে...' : '📤 সম্পাদকের কাছে পাঠান'}
                </button>
              </>
            )}

            {/* ── Admin / Editor buttons ───────────────────────────────── */}
            {!isReporter && (
              <>
                {/* Save as DRAFT */}
                <button
                  onClick={() => handleSubmit('DRAFT')}
                  disabled={loading}
                  className="bg-[#1E1E2E] text-[#E2E8F0] px-4 py-2 rounded text-sm hover:bg-[#2E2E3E] border border-[#2E2E3E] transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : '💾 ড্রাফট সংরক্ষণ'}
                </button>

                {/* Publish directly */}
                <button
                  onClick={() => handleSubmit('PUBLISHED')}
                  disabled={loading}
                  className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'হচ্ছে...' : '🚀 প্রকাশ করুন'}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 text-[#E53E3E] text-sm px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#16A34A] text-sm px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Reporter info banner */}
        {isReporter && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-3 rounded mb-6 flex items-center gap-2">
            <span>ℹ️</span>
            <span>
              <strong>ড্রাফট সংরক্ষণ</strong> — শুধু আপনি দেখতে পাবেন।&nbsp;&nbsp;
              <strong>সম্পাদকের কাছে পাঠান</strong> — সম্পাদক অনুমোদন করলে প্রকাশিত হবে।
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">শিরোনাম *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="সংবাদের শিরোনাম লিখুন..."
                className="w-full bg-[#111118] text-[#E2E8F0] placeholder-[#64748B] border border-[#1E1E2E] rounded px-4 py-3 text-base focus:outline-none focus:border-[#E53E3E] transition-colors"
              />
            </div>
            <div>
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">সংক্ষিপ্ত বিবরণ</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="সংক্ষিপ্ত বিবরণ লিখুন..."
                rows={3}
                className="w-full bg-[#111118] text-[#E2E8F0] placeholder-[#64748B] border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors resize-none"
              />
            </div>
            <div>
              <ArticleEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Thumbnail */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-3">থাম্বনেইল</label>
              {thumbnailPreview ? (
                <div className="relative">
                  <img src={thumbnailPreview} alt="preview" className="w-full h-40 object-cover rounded" />
                  <button
                    onClick={() => { setThumbnail(null); setThumbnailPreview(''); }}
                    className="absolute top-2 right-2 bg-[#E53E3E] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-[#1E1E2E] rounded-lg p-6 text-center cursor-pointer hover:border-[#E53E3E] transition-colors">
                  <div className="text-[#64748B] text-sm">ছবি আপলোড করুন</div>
                  <div className="text-[#64748B] text-xs mt-1">JPG, PNG, WEBP</div>
                  <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
                </label>
              )}
            </div>

            {/* Category */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-3">বিভাগ *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full bg-[#1E1E2E] text-[#E2E8F0] border border-[#2E2E3E] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
              >
                <option value="">বিভাগ বেছে নিন</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* 🔹 CHANGE 2: Added Source / Reference Link Input Field 🔹 */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase block mb-3 font-bold tracking-wider">সোর্স / বিস্তারিত লিঙ্ক</label>
              <input 
                type="url" 
                value={form.source} 
                onChange={(e) => setForm({ ...form, source: e.target.value })} 
                placeholder="https://example.com" 
                className="w-full bg-[#1E1E2E] text-[#E2E8F0] border border-[#2E2E3E] rounded px-3 py-2 text-sm outline-none focus:border-[#E53E3E] transition-colors" 
              />
              <p className="text-[10px] text-[#64748B] mt-2 italic">এখানে লিঙ্ক দিলে আর্টিকেলের শেষে "Read More" বাটন আসবে।</p>
            </div>

            {/* Breaking / Featured — Admin/Editor only */}
            {!isReporter && (
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4 space-y-3">
                <label className="text-[#64748B] text-xs uppercase tracking-wider block">অপশন</label>
                {[
                  { label: '🔴 ব্রেকিং নিউজ', key: 'isBreaking' },
                  { label: '⭐ ফিচার্ড',       key: 'isFeatured' },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, [opt.key]: !form[opt.key as keyof typeof form] })}
                      className={`w-10 h-5 rounded-full transition-colors ${
                        form[opt.key as keyof typeof form] ? 'bg-[#E53E3E]' : 'bg-[#1E1E2E]'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${
                        form[opt.key as keyof typeof form] ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
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