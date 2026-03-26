'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SECRET = 'BCN@NewsRoom#2024!SecretKey';

export default function AdminGatePage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const handleSubmit = () => {
    if (code === SECRET) {
      sessionStorage.setItem('bcn-admin-gate', 'true');
      router.push('/newsroom-bcn-2024');
    } else {
      setAttempts(a => a + 1);
      setError(`অ্যাক্সেস অস্বীকৃত। ${attempts + 1 >= 3 ? 'অনেকবার চেষ্টা করা হয়েছে।' : 'ভুল কোড।'}`);
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-2xl rounded-lg mx-auto mb-4">BCN</div>
          <h1 className="text-white font-bold text-xl">নিরাপদ অ্যাক্সেস</h1>
          <p className="text-[#64748B] text-sm mt-1">অ্যাক্সেস কোড প্রবেশ করুন</p>
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 space-y-4">
          <input
            type="password"
            value={code}
            onChange={e => { setCode(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••••••••••"
            className="w-full bg-[#0A0A0F] text-white border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors tracking-widest"
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#E53E3E] text-white py-3 rounded font-bold text-sm hover:bg-red-700 transition-colors"
          >
            প্রবেশ করুন
          </button>
        </div>

        <p className="text-center text-[#1E1E2E] text-xs mt-6">
          © BCN – The Bengal Chronicle Network
        </p>
      </div>
    </div>
  );
}
