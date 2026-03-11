'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:8000/api/v1';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('সব ঘর পূরণ করুন');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না');
      return;
    }
    if (form.password.length < 8) {
      setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/auth/login');
      } else {
        setError(data.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }
    } catch {
      setError('নেটওয়ার্ক সমস্যা হয়েছে');
    } finally {
      setLoading(false);
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
            নিবন্ধন করুন
          </h1>
          <p className="text-[#64748B] text-sm mt-2">BCN এ নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {/* Form */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-8 space-y-5">
          {error && (
            <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 text-[#E53E3E] text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">নাম</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="আপনার পুরো নাম"
              className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">ইমেইল</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="আপনার ইমেইল"
              className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">পাসওয়ার্ড</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="পাসওয়ার্ড আবার লিখুন"
              className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#E53E3E] text-white py-3 rounded text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                নিবন্ধন হচ্ছে...
              </span>
            ) : 'নিবন্ধন করুন'}
          </button>

          <div className="text-center pt-2">
            <span className="text-[#64748B] text-xs">ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
            <Link href="/auth/login" className="text-[#E53E3E] text-xs hover:underline">লগইন করুন</Link>
          </div>
        </div>
      </div>
    </div>
  );
}