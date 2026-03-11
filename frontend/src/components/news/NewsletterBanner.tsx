'use client';
import { useState } from 'react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return;
    setDone(true);
  };

  return (
    <section className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-8 text-center my-10">
      <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
        নিউজলেটার সাবস্ক্রাইব করুন
      </h3>
      <p className="text-[#64748B] text-sm mb-5">প্রতিদিনের সেরা সংবাদ সরাসরি আপনার ইনবক্সে পান।</p>
      {done ? (
        <p className="text-[#16A34A] text-sm">✅ ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</p>
      ) : (
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="আপনার ইমেইল"
            className="flex-1 bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
          />
          <button
            onClick={handleSubmit}
            className="bg-[#E53E3E] text-white px-5 py-2.5 rounded text-sm hover:bg-red-700 transition-colors"
          >
            সাবস্ক্রাইব
          </button>
        </div>
      )}
    </section>
  );
}