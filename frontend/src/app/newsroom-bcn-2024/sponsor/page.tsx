'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { api } from '../../../lib/api';

export default function SponsorManagerPage() {
  const { user, isAuthenticated, isLoading: authLoading, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [allAds, setAllAds] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ 
    title: '', linkUrl: '', imageUrl: '', isActive: false, position: 'POPUP', duration: 5 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.push('/auth/login'); 
      return;
    }
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      router.push('/newsroom-bcn-2024');
      return;
    }
    fetchAllSponsors();
  }, [isAuthenticated, user, authLoading, router]);

  const fetchAllSponsors = async () => {
    try {
      const res = await api.get<any>('/sponsor');
      if (res.data) setAllAds(res.data);
    } catch (err) {}
  };

  const handleEdit = (ad: any) => {
    setEditingId(ad.id);
    setForm({ 
      title: ad.title || '', linkUrl: ad.linkUrl || '', 
      imageUrl: ad.imageUrl || '', isActive: ad.isActive, 
      position: ad.position, duration: ad.duration || 5 
    });
    setImagePreview(ad.imageUrl);
    setImageFile(null);
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if(!confirm('সত্যিই এই বিজ্ঞাপনটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/sponsor/${id}`);
      fetchAllSponsors();
      if(editingId === id) resetForm();
    } catch(err) { alert('ডিলিট করা যায়নি'); }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', linkUrl: '', imageUrl: '', isActive: false, position: 'POPUP', duration: 5 });
    setImagePreview('');
    setImageFile(null);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true); setSuccess('');
    try {
      let finalImageUrl = form.imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await api.upload<any>('/media', formData);
        finalImageUrl = uploadRes.data?.url || '';
      }
      
      const payload = { ...form, imageUrl: finalImageUrl, id: editingId };
      await api.post<any>('/sponsor', payload);
      setSuccess(editingId ? 'বিজ্ঞাপন আপডেট হয়েছে!' : 'নতুন বিজ্ঞাপন তৈরি হয়েছে!');
      fetchAllSponsors();
      resetForm();
    } catch (err) {
      alert('সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A1A3A] text-gray-900 dark:text-white">Loading...</div>;
  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen font-bangla p-8 bg-gray-50 dark:bg-[#0A1A3A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <span onClick={() => router.back()} className="text-blue-600 dark:text-[#D4AF37] hover:underline mb-6 inline-block font-mono text-sm cursor-pointer select-none">
          ← ড্যাশবোর্ডে ফিরে যান
        </span>
        
        <h2 className="text-gray-900 dark:text-white font-bold text-3xl mb-8 tracking-widest font-mono">
          SPONSOR MANAGEMENT
        </h2>

        {success && <div className="bg-green-100 dark:bg-green-500/10 border border-green-400 dark:border-green-500/30 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6 shadow-md">✅ {success}</div>}

        <div className="bg-white dark:bg-[#0A1A3A]/60 border border-gray-200 dark:border-[#D4AF37]/20 p-8 rounded-2xl shadow-lg dark:shadow-2xl mb-10 transition-colors">
          <h3 className="text-blue-700 dark:text-[#D4AF37] font-bold text-xl mb-6">
            {editingId ? 'বিজ্ঞাপন এডিট করুন' : 'নতুন বিজ্ঞাপন তৈরি করুন'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-gray-500 dark:text-gray-300 text-xs uppercase mb-1 block">বিজ্ঞাপনের ধরন</label>
                  <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0A1A3A]/80 text-gray-900 dark:text-white border border-gray-300 dark:border-[#D4AF37]/30 rounded p-3 focus:outline-none focus:border-blue-500 dark:focus:border-[#D4AF37]">
                    <option value="POPUP">📺 পপআপ (Popup)</option>
                    <option value="TOP">⬆️ টপ ব্যানার (Top)</option>
                    <option value="BOTTOM">⬇️ বটম ফিক্সড (Bottom Mobile)</option>
                    <option value="SIDEBAR">📱 সাইডবার (Sidebar Desktop)</option>
                    <option value="IN_CONTENT">📝 আর্টিকেলের মাঝে (In-Content)</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="text-gray-500 dark:text-gray-300 text-xs uppercase mb-1 block">সময় (সেকেন্ড)</label>
                  <input type="number" min="0" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 dark:bg-[#0A1A3A]/80 text-gray-900 dark:text-white border border-gray-300 dark:border-[#D4AF37]/30 rounded p-3 focus:outline-none focus:border-blue-500 dark:focus:border-[#D4AF37]" placeholder="5" disabled={form.position !== 'POPUP'} title="এটি শুধুমাত্র পপআপ অ্যাডের জন্য কাজ করবে" />
                </div>
              </div>

              <div>
                <label className="text-gray-500 dark:text-gray-300 text-xs uppercase mb-1 block">শিরোনাম</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0A1A3A]/80 text-gray-900 dark:text-white border border-gray-300 dark:border-[#D4AF37]/30 rounded p-3 focus:outline-none focus:border-blue-500 dark:focus:border-[#D4AF37]" placeholder="বিজ্ঞাপনের নাম..." />
              </div>
              
              <div>
                <label className="text-gray-500 dark:text-gray-300 text-xs uppercase mb-1 block">লিঙ্ক (URL)</label>
                <input type="url" value={form.linkUrl} onChange={e => setForm({...form, linkUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0A1A3A]/80 text-gray-900 dark:text-white border border-gray-300 dark:border-[#D4AF37]/30 rounded p-3 focus:outline-none focus:border-blue-500 dark:focus:border-[#D4AF37]" placeholder="https://..." />
              </div>
              
              <div className="bg-gray-50 dark:bg-[#0A1A3A]/80 border border-gray-300 dark:border-[#D4AF37]/30 p-4 rounded flex justify-between items-center">
                <span className="text-gray-900 dark:text-white font-bold text-sm">ওয়েবসাইটে চালু করুন</span>
                <label className="flex items-center cursor-pointer">
                  <div onClick={() => setForm({...form, isActive: !form.isActive})} className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-blue-600 dark:bg-[#D4AF37]' : 'bg-gray-400 dark:bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 absolute transition-transform ${form.isActive ? 'translate-x-6.5 left-0.5' : 'translate-x-0.5'}`} />
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="text-gray-500 dark:text-gray-300 text-xs uppercase mb-1 block">ব্যানার ছবি</label>
              <div className="bg-gray-50 dark:bg-[#0A1A3A]/80 border border-gray-300 dark:border-[#D4AF37]/30 rounded-lg p-2 h-[260px] flex items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img src={imagePreview} className="w-full h-full object-contain rounded bg-gray-200 dark:bg-black/50" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setForm({...form, imageUrl: ''}); }} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-xl hover:bg-red-600 transition-colors">✕</button>
                  </div>
                ) : (
                  <label className="block w-full h-full border-2 border-dashed border-gray-300 dark:border-[#D4AF37]/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-[#D4AF37] hover:bg-gray-100 dark:hover:bg-[#D4AF37]/5 transition-all">
                    <div className="text-gray-400 dark:text-[#D4AF37] text-4xl mb-3">📸</div>
                    <div className="text-gray-600 dark:text-white text-sm font-bold">ছবি সিলেক্ট করুন</div>
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            {editingId && <button type="button" onClick={resetForm} className="px-6 py-3 rounded text-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">বাতিল</button>}
            <button type="button" onClick={handleSave} disabled={loading || (!form.imageUrl && !imageFile)} className="px-8 py-3 rounded font-bold text-white dark:text-[#0A1A3A] bg-blue-600 hover:bg-blue-700 dark:bg-none transition-all hover:scale-105 disabled:opacity-50" style={{ background: document.documentElement.classList.contains('dark') ? 'linear-gradient(135deg, #D4AF37, #B8960C)' : '' }}>
               {loading ? '...' : 'সেভ করুন'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A1A3A]/60 border border-gray-200 dark:border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg dark:shadow-2xl transition-colors">
          <div className="p-5 border-b border-gray-200 dark:border-[#D4AF37]/20 bg-gray-50 dark:bg-[#0A1A3A]">
            <h3 className="text-gray-900 dark:text-white font-bold">সব বিজ্ঞাপন</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 dark:bg-[#0A1A3A]/40 text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="p-4">ছবি</th>
                  <th className="p-4">শিরোনাম</th>
                  <th className="p-4">ধরণ</th>
                  <th className="p-4">সময়</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-[#D4AF37]/10">
                {allAds.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">কোনো বিজ্ঞাপন নেই</td></tr>}
                {allAds.map(ad => (
                  <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-[#D4AF37]/5 transition-colors">
                    <td className="p-4"><img src={ad.imageUrl} alt="ad" className="h-10 w-16 object-cover rounded bg-gray-200 dark:bg-black" /></td>
                    <td className="p-4 text-gray-900 dark:text-white font-medium">{ad.title || 'Untitled'}</td>
                    <td className="p-4">
                      <span className="text-blue-700 dark:text-[#D4AF37] bg-blue-100 dark:bg-[#D4AF37]/10 px-2 py-1 rounded text-xs">{ad.position}</span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{ad.position === 'POPUP' ? `${ad.duration || 5}s` : 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ad.isActive ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-500/10' : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-500/10'}`}>
                        {ad.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button type="button" onClick={() => handleEdit(ad)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1 rounded mr-2 transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(ad.id)} className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-1 rounded transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}