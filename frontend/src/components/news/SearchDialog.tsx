'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg w-full max-w-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-[#1E1E2E]">
          <span className="text-[#64748B]">🔍</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="সংবাদ খুঁজুন..."
            className="flex-1 bg-transparent text-[#E2E8F0] placeholder-[#64748B] text-sm focus:outline-none"
          />
          <button onClick={onClose} className="text-[#64748B] hover:text-white text-xs">ESC</button>
        </div>
        <div className="p-4 text-xs text-[#64748B]">
          Enter চাপুন অথবা{' '}
          <button onClick={handleSearch} className="text-[#E53E3E] hover:underline">এখানে ক্লিক করুন</button>
        </div>
      </div>
    </div>
  );
}