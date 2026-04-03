'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { api } from '../../../lib/api';

export default function AdminUsersPage() {
  // 🔹 FIX 1: Added authLoading to prevent premature kicks
  const { isAuthenticated, isLoading: authLoading, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'JOURNALIST' });

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (authLoading) return; // Wait for session check
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, authLoading, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get<any>('/users');
      setUsers(data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<any>('/users', formData);
      if (res.success) {
        alert('সফলভাবে তৈরি হয়েছে');
        setShowForm(false);
        setFormData({ name: '', email: '', password: '', role: 'JOURNALIST' });
        fetchUsers();
      } else {
        alert(res.message || 'ব্যর্থ হয়েছে');
      }
    } catch (err) {
      alert('সিস্টেমে সমস্যা হয়েছে');
    }
  };

  if (authLoading) return <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-[#64748B]">লোড হচ্ছে...</div>;
  if (!isAuthenticated) return null;

  const roleColor: Record<string, string> = {
    SUPER_ADMIN: 'bg-[#E53E3E]/20 text-[#E53E3E] border border-[#E53E3E]/20',
    ADMIN: 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/20',
    EDITOR: 'bg-[#3182CE]/20 text-[#3182CE] border border-[#3182CE]/20',
    JOURNALIST: 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/20',
    READER: 'bg-[#64748B]/20 text-[#64748B] border border-[#64748B]/20',
  };

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: 'সুপার অ্যাডমিন',
    ADMIN: 'অ্যাডমিন',
    EDITOR: 'এডিটর',
    JOURNALIST: 'সাংবাদিক',
    READER: 'পাঠক',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* 🔹 FIX 2: Sticky Header and max-w-5xl alignment */}
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 🔹 FIX 3: Link points to correct Dashboard */}
            <Link href="/newsroom-bcn-2024" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm shadow-lg">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">ইউজার ম্যানেজমেন্ট</h1>
              {/* 🔹 FIX 4: Real Back logic */}
              <span onClick={() => router.back()} className="text-[#64748B] text-xs hover:text-[#E53E3E] cursor-pointer select-none transition-colors">
                ← ফিরে যান
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#E53E3E] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
          >
            {showForm ? '✕ বন্ধ করুন' : '+ নতুন ইউজার'}
          </button>
        </div>
      </header>

      {/* 🔹 FIX 5: Content width set to max-w-5xl to match rest of the app */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Notun User Add korar Form */}
        {showForm && (
          <div className="mb-8 bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-white font-bold mb-5 tracking-wide">নতুন ইউজার/রিপোর্টার যোগ করুন</h3>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <input 
                type="text" placeholder="নাম" required
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-[#E2E8F0] p-3 rounded-lg text-sm focus:border-[#E53E3E] outline-none transition-all"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" placeholder="ইমেইল" required
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-[#E2E8F0] p-3 rounded-lg text-sm focus:border-[#E53E3E] outline-none transition-all"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="password" placeholder="পাসওয়ার্ড" required
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-[#E2E8F0] p-3 rounded-lg text-sm focus:border-[#E53E3E] outline-none transition-all"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <select 
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-[#E2E8F0] p-3 rounded-lg text-sm focus:border-[#E53E3E] outline-none transition-all cursor-pointer"
                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="JOURNALIST">সাংবাদিক (JOURNALIST)</option>
                <option value="EDITOR">এডিটর (EDITOR)</option>
                <option value="ADMIN">অ্যাডমিন (ADMIN)</option>
              </select>
              <button type="submit" className="lg:col-span-4 bg-[#E53E3E] hover:bg-red-700 text-white font-bold p-3 rounded-lg text-sm mt-2 transition-colors shadow-lg shadow-red-500/20">
                তৈরি করুন
              </button>
            </form>
          </div>
        )}

        {/* User List Table */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-[#1E1E2E] flex items-center justify-between bg-[#0A0A0F]/50">
            <h3 className="text-white font-bold tracking-wide">সব ব্যবহারকারী</h3>
            <span className="bg-[#1E1E2E] text-[#E2E8F0] px-3 py-1 rounded-full text-xs font-medium">মোট: {users.length} জন</span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-[#64748B] text-sm font-medium">লোড হচ্ছে...</div>
          ) : users.length === 0 ? (
            <div className="px-6 py-16 text-center text-[#64748B] text-sm font-medium">কোনো ব্যবহারকারী নেই</div>
          ) : (
            <div className="divide-y divide-[#1E1E2E]">
              {users.map((user: any) => (
                <div key={user.id} className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#1E1E2E]/40 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#1E1E2E] border border-[#E53E3E]/30 flex items-center justify-center text-white font-bold shadow-inner group-hover:border-[#E53E3E]/70 transition-colors">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm text-[#E2E8F0] font-bold group-hover:text-white transition-colors">{user.name}</h4>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-1.5 rounded-md font-bold uppercase tracking-wider ${roleColor[user.role] || 'bg-[#64748B]/20 text-[#64748B] border border-[#64748B]/20'}`}>
                      {roleLabel[user.role] || user.role}
                    </span>
                    <span className={`text-[10px] px-2.5 py-1.5 rounded-md font-bold tracking-wider border ${user.isActive ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30' : 'bg-[#E53E3E]/10 text-[#E53E3E] border-[#E53E3E]/30'}`}>
                      {user.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}