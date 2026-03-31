'use client';
import Link from 'next/link';
import { useAuthStore } from '../../../store/auth.store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const { isAuthenticated, loadFromStorage, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => { loadFromStorage(); }, []);
  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="bg-[#111118] border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</Link>
            <div>
              <h1 className="text-white font-bold text-sm">সেটিংস</h1>
              <Link href="/admin" className="text-[#64748B] text-xs hover:text-[#E53E3E]">← Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Profile */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-6">
          <h3 className="text-white font-bold mb-4">প্রোফাইল</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E53E3E] flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-[#64748B] text-sm">{user?.email}</p>
              <p className="text-[#E53E3E] text-xs uppercase mt-1">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Site Info */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-6">
          <h3 className="text-white font-bold mb-4">সাইট তথ্য</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: 'সাইটের নাম', value: 'The Bengal Chronicle Network' },
              { label: 'ডোমেইন', value: 'bengalchronicle.in' },
              { label: 'ভার্সন', value: '1.0.0' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1E1E2E] last:border-0">
                <span className="text-[#64748B]">{item.label}</span>
                <span className="text-[#E2E8F0]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
            
        {/* Danger Zone */}
        <div className="bg-[#111118] border border-[#E53E3E]/20 rounded-lg p-6">
          <h3 className="text-[#E53E3E] font-bold mb-4">Danger Zone</h3>
          <button
            onClick={logout}
            className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 text-[#E53E3E] px-4 py-2 rounded text-sm hover:bg-[#E53E3E]/20 transition-colors"
          >
            লগআউট করুন
          </button>
        </div>
      </div>
    </div>
  );
}