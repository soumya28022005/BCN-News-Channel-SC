'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { api } from '../../../lib/api';

export default function AdminUsersPage() {
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Notun User Add korar state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'JOURNALIST' });

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, router]);

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
        alert('সফলভাবে তৈরি হয়েছে');
        setShowForm(false);
        setFormData({ name: '', email: '', password: '', role: 'JOURNALIST' });
        fetchUsers();
      } else {
        alert(res.message || 'ব্যর্থ হয়েছে');
      }
    } catch (err) {
      alert('সিস্টেমে সমস্যা হয়েছে');
    }
  };

  if (!isAuthenticated) return null;

  const roleColor: Record<string, string> = {
    SUPER_ADMIN: 'bg-[#E53E3E]/20 text-[#E53E3E]',
    ADMIN: 'bg-[#D97706]/20 text-[#D97706]',
    EDITOR: 'bg-[#3182CE]/20 text-[#3182CE]',
    JOURNALIST: 'bg-[#16A34A]/20 text-[#16A34A]',
    READER: 'bg-[#64748B]/20 text-[#64748B]',
  };

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: 'সুপার অ্যাডমিন',
    ADMIN: 'অ্যাডমিন',
    EDITOR: 'এডিটর',
    JOURNALIST: 'সাংবাদিক/রিপোর্টার',
    READER: 'পাঠক',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">ইউজার ম্যানেজমেন্ট</h1>
              <Link href="/admin" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← ড্যাশবোর্ড</Link>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#E53E3E] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#C53030] transition-colors"
          >
            {showForm ? 'বন্ধ করুন' : '+ নতুন ইউজার'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Notun User Add korar Form */}
        {showForm && (
          <div className="mb-8 bg-[#111118] border border-[#E53E3E]/30 rounded-lg p-6 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-white font-bold mb-4">নতুন ইউজার/রিপোর্টার যোগ করুন</h3>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input 
                type="text" placeholder="নাম" required
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-white p-2 rounded text-sm focus:border-[#E53E3E] outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" placeholder="ইমেইল" required
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-white p-2 rounded text-sm focus:border-[#E53E3E] outline-none"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="password" placeholder="পাসওয়ার্ড" required
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-white p-2 rounded text-sm focus:border-[#E53E3E] outline-none"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <select 
                className="bg-[#0A0A0F] border border-[#1E1E2E] text-white p-2 rounded text-sm focus:border-[#E53E3E] outline-none"
                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="JOURNALIST">সাংবাদিক (JOURNALIST)</option>
                <option value="EDITOR">এডিটর (EDITOR)</option>
                <option value="ADMIN">অ্যাডমিন (ADMIN)</option>
              </select>
              <button type="submit" className="lg:col-span-4 bg-[#E53E3E] text-white font-bold p-2 rounded text-sm mt-2">তৈরি করুন</button>
            </form>
          </div>
        )}

        {/* User List Table */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg">
          <div className="px-6 py-4 border-b border-[#1E1E2E] flex items-center justify-between">
            <h3 className="text-white font-bold">সব ব্যবহারকারী</h3>
            <span className="text-[#64748B] text-xs">মোট: {users.length} জন</span>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-[#64748B] text-sm">লোড হচ্ছে...</div>
          ) : users.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#64748B] text-sm">কোনো ব্যবহারকারী নেই</div>
          ) : (
            <div className="divide-y divide-[#1E1E2E]">
              {users.map((user: any) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#1E1E2E]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#1E1E2E] border border-[#E53E3E]/20 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm text-[#E2E8F0] font-medium">{user.name}</h4>
                      <p className="text-[10px] text-[#64748B]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${roleColor[user.role] || 'bg-[#64748B]/20 text-[#64748B]'}`}>
                      {roleLabel[user.role] || user.role}
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${user.isActive ? 'bg-[#16A34A]/20 text-[#16A34A]' : 'bg-[#E53E3E]/20 text-[#E53E3E]'}`}>
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