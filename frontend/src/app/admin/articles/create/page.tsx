'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../store/auth.store';
import { api } from '../../../../lib/api';
import ArticleEditor from '../../../../components/admin/ArticleEditor';

export default function CreateArticlePage() {
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', categoryId: '',
    isBreaking: false, isFeatured: false, status: 'DRAFT',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    fetchCategories();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    const data = await api.get<any>('/categories');
    setCategories(data.data || []);
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (publish: boolean) => {
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
      const articleData: any = { ...form, ...(thumbnailUrl && { thumbnail: thumbnailUrl }) };
      const res = await api.post<any>('/articles', articleData);
      if (res.success && res.data?.id) {
        if (publish) await api.patch(`/articles/${res.data.id}/publish`);
        setSuccess(publish ? 'সংবাদ প্রকাশিত হয়েছে!' : 'ড্রাফট সংরক্ষিত হয়েছে!');
        setTimeout(() => router.push('/admin/articles'), 1500);
      } else {
        setError('সংবাদ তৈরি করা যায়নি');
      }
    } catch {
      setError('কিছু একটা সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">নতুন সংবাদ</h1>
              <Link href="/admin/articles" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← সব সংবাদ</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSubmit(false)} disabled={loading}
              className="bg-[#1E1E2E] text-[#E2E8F0] px-4 py-2 rounded text-sm hover:bg-[#2E2E3E] transition-colors disabled:opacity-50">
              ড্রাফট সংরক্ষণ
            </button>
            <button onClick={() => handleSubmit(true)} disabled={loading}
              className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
              {loading ? 'হচ্ছে...' : 'প্রকাশ করুন'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 text-[#E53E3E] text-sm px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#16A34A] text-sm px-4 py-3 rounded mb-6">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">শিরোনাম *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="সংবাদের শিরোনাম লিখুন..."
                className="w-full bg-[#111118] text-[#E2E8F0] placeholder-[#64748B] border border-[#1E1E2E] rounded px-4 py-3 text-base focus:outline-none focus:border-[#E53E3E] transition-colors" />
            </div>
            <div>
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">সংক্ষিপ্ত বিবরণ</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="সংক্ষিপ্ত বিবরণ লিখুন..." rows={3}
                className="w-full bg-[#111118] text-[#E2E8F0] placeholder-[#64748B] border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors resize-none" />
            </div>
            <div>
              <ArticleEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-3">থাম্বনেইল</label>
              {thumbnailPreview ? (
                <div className="relative">
                  <img src={thumbnailPreview} alt="preview" className="w-full h-40 object-cover rounded" />
                  <button onClick={() => { setThumbnail(null); setThumbnailPreview(''); }}
                    className="absolute top-2 right-2 bg-[#E53E3E] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">✕</button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-[#1E1E2E] rounded-lg p-6 text-center cursor-pointer hover:border-[#E53E3E] transition-colors">
                  <div className="text-[#64748B] text-sm">ছবি আপলোড করুন</div>
                  <div className="text-[#64748B] text-xs mt-1">JPG, PNG, WEBP</div>
                  <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
                </label>
              )}
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
              <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-3">বিভাগ *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full bg-[#1E1E2E] text-[#E2E8F0] border border-[#2E2E3E] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors">
                <option value="">বিভাগ বেছে নিন</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4 space-y-3">
              <label className="text-[#64748B] text-xs uppercase tracking-wider block">অপশন</label>
              {[
                { label: '🔴 ব্রেকিং নিউজ', key: 'isBreaking' },
                { label: '⭐ ফিচার্ড', key: 'isFeatured' },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm({ ...form, [opt.key]: !form[opt.key as keyof typeof form] })}
                    className={`w-10 h-5 rounded-full transition-colors ${form[opt.key as keyof typeof form] ? 'bg-[#E53E3E]' : 'bg-[#1E1E2E]'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${form[opt.key as keyof typeof form] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-[#E2E8F0] text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}