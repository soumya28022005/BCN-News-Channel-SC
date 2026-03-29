'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../lib/api';

export default function SponsorManagerPage() {
  const { user, isAuthenticated, loadFromStorage, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    linkUrl: '',
    imageUrl: '',
    isActive: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/auth/login'); return; }
    
    // Only SUPER_ADMIN or ADMIN should access this page
    if (user && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      router.push('/newsroom-bcn-2024');
    } else if (user) {
      fetchCurrentSponsor();
    }
  }, [isAuthenticated, user, router]);

  const fetchCurrentSponsor = async () => {
    try {
      const res = await api.get<any>('/sponsor');
      if (res.data) {
        setForm({
          title: res.data.title || '',
          linkUrl: res.data.linkUrl || '',
          imageUrl: res.data.imageUrl || '',
          isActive: res.data.isActive || false,
        });
        setImagePreview(res.data.imageUrl || '');
      }
    } catch (err) {
      console.log("No existing sponsor data found.");
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    try {
      let finalImageUrl = form.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await api.upload<any>('/media', formData);
        finalImageUrl = uploadRes.data?.url || '';
      }

      const payload = {
        ...form,
        imageUrl: finalImageUrl,
      };

      // Send to backend (Assuming a POST or PATCH to /sponsor updates the global ad)
      await api.post<any>('/sponsor', payload);
      setSuccess('স্পন্সর কন্টেন্ট সফলভাবে আপডেট হয়েছে!');
      setForm({ ...form, imageUrl: finalImageUrl });
    } catch (err) {
      alert('আপডেট করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen relative font-bangla" style={{ background: 'radial-gradient(circle at top, #1A2E5A, #0A1A3A)' }}>
      <header className="px-8 py-4 sticky top-0 z-20 flex items-center justify-between bg-[#0A1A3A]/80 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-4">
          <Link href="/newsroom-bcn-2024" className="text-[#D4AF37] text-sm hover:underline">← ড্যাশবোর্ড</Link>
          <h2 className="text-white font-bold tracking-widest text-lg">SPONSOR MANAGEMENT</h2>
        </div>
      </header>

      <div className="p-8 max-w-4xl mx-auto">
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded mb-6">
            ✅ {success}
          </div>
        )}

        <div className="rounded-xl overflow-hidden p-6 shadow-2xl border border-[#D4AF37]/20" style={{ background: 'rgba(15, 33, 71, 0.6)', backdropFilter: 'blur(12px)' }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Form */}
            <div className="space-y-6">
              <div>
                <label className="text-[#D4AF37] text-xs uppercase tracking-widest block mb-2 font-mono">বিজ্ঞাপনের শিরোনাম</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Summer Sale 2026"
                  className="w-full bg-[#0A1A3A]/60 text-white border border-[#D4AF37]/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="text-[#D4AF37] text-xs uppercase tracking-widest block mb-2 font-mono">লিঙ্ক (URL)</label>
                <input
                  type="url"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-[#0A1A3A]/60 text-white border border-[#D4AF37]/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div className="bg-[#0A1A3A]/40 border border-[#D4AF37]/20 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">বিজ্ঞাপন চালু করুন</h4>
                  <p className="text-xs text-gray-400 mt-1">এটি চালু করলে মূল ওয়েবসাইটে বিজ্ঞাপনটি দেখাবে</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-[#D4AF37]' : 'bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 absolute transition-transform ${form.isActive ? 'translate-x-6.5 left-0.5' : 'translate-x-0.5'}`} />
                  </div>
                </label>
              </div>
            </div>

            {/* Right Side: Image Upload */}
            <div>
              <label className="text-[#D4AF37] text-xs uppercase tracking-widest block mb-2 font-mono">বিজ্ঞাপনের ছবি (Banner)</label>
              <div className="bg-[#0A1A3A]/40 border border-[#D4AF37]/20 rounded-lg p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded border border-[#D4AF37]/30" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(''); setForm({...form, imageUrl: ''}); }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-xs flex items-center justify-center shadow-lg"
                    >✕</button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-[#D4AF37]/30 rounded-lg p-10 text-center cursor-pointer hover:border-[#D4AF37] transition-colors">
                    <div className="text-[#D4AF37] text-2xl mb-2">📸</div>
                    <div className="text-white text-sm">ছবি আপলোড করুন</div>
                    <div className="text-gray-400 text-xs mt-1">1920x1080 (Landscape) প্রস্তাবিত</div>
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#D4AF37]/20 pt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading || (!form.imageUrl && !imageFile)}
              className="px-8 py-3 rounded-lg font-bold text-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0A1A3A' }}
            >
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'সেভ করুন'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}