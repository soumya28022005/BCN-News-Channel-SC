'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('ইমেইল ও পাসওয়ার্ড দিন');
      return;
    }
    setError('');
    const result = await login(email, password);
    if (result.success) {
      router.push('/admin');
    } else {
      setError('ইমেইল বা পাসওয়ার্ড ভুল');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="w-14 h-14 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-xl rounded-sm mx-auto mb-4">
              BCN
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            লগইন করুন
          </h1>
          <p className="text-[#64748B] text-sm mt-2">BCN Admin Panel</p>
        </div>

        {/* Form */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-8 space-y-5">
          {error && (
            <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 text-[#E53E3E] text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="admin@bengalchronicle.com"
              className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#E53E3E] text-white py-3 rounded text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                লগইন হচ্ছে...
              </span>
            ) : 'লগইন'}
          </button>

          <div className="text-center pt-2">
            <Link href="/" className="text-[#64748B] text-xs hover:text-[#E53E3E] transition-colors">
              ← হোমপেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}