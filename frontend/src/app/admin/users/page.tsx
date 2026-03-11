'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../lib/api';

export default function AdminUsersPage() {
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchUsers();
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get<any>('/users');
      setUsers(data.data || []);
    } catch { }
    finally { setLoading(false); }
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
    JOURNALIST: 'সাংবাদিক',
    READER: 'পাঠক',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header */}
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">
              BCN
            </Link>
            <div>
              <h1 className="text-white font-bold text-sm">ব্যবহারকারী</h1>
              <Link href="/admin" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1E1E2E]">
            <h3 className="text-white font-bold">সব ব্যবহারকারী</h3>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-[#64748B] text-sm">লোড হচ্ছে...</div>
          ) : users.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#64748B] text-sm">কোনো ব্যবহারকারী নেই</div>
          ) : (
            <div className="divide-y divide-[#1E1E2E]">
              {users.map((user: any) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E53E3E] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm text-[#E2E8F0] font-medium">{user.name}</h4>
                      <p className="text-xs text-[#64748B]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${roleColor[user.role] || 'bg-[#64748B]/20 text-[#64748B]'}`}>
                      {roleLabel[user.role] || user.role}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${user.isActive ? 'bg-[#16A34A]/20 text-[#16A34A]' : 'bg-[#64748B]/20 text-[#64748B]'}`}>
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