'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // 🔹 Next.js Image component import করা হলো
import { useAuthStore } from '../../../store/auth.store';

// 🔹 লোগো ফাইলটি সরাসরি import করা হলো (পাথ ঠিক থাকলে কাজ করবে)
import logoImg from '../../../components/layout/logo/log.png';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, loadFromStorage } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/newsroom-bcn-2024');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setError('');

    const result = await login(email, password);

    if (result.success) {
      router.replace('/newsroom-bcn-2024');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    // 🔹 fixed inset-0 z-50 দেওয়া হলো যাতে Header এর ওপর এই পেজটা কভার করে নেয়
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a] px-4 sm:px-6 lg:px-8 font-sans overflow-y-auto">
      <div className="max-w-md w-full space-y-8 bg-[#1e293b] p-10 rounded-2xl shadow-2xl border border-gray-800 my-auto">
        
        {/* 🔹 Logo & Header Section */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative mb-2">
            {/* 🔹 Next.js Image component ব্যবহার করা হলো */}
             <Image 
               src={logoImg} 
               alt="Bengal Chronicle Network" 
               fill
               className="object-contain drop-shadow-lg"
               priority
             />
          </div>
          <h1 className="text-center text-2xl font-bold text-white tracking-wide">
            BCN Admin Login
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Login to the newsroom panel
          </p>
        </div>

        {/* 🔹 Error Message Banner */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* 🔹 Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#0f172a] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="admin@bengalchronicle.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#0f172a] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#1e293b] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}