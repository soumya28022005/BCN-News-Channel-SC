'use client';
import { useState } from 'react';

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    setSubmitted(true);
    setComment('');
  };

  return (
    <section className="mt-10 pt-8 border-t border-[#1E1E2E]">
      <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
        মন্তব্য করুন
      </h3>
      {submitted ? (
        <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#16A34A] text-sm px-4 py-3 rounded mb-4">
          ✅ আপনার মন্তব্য জমা হয়েছে।
        </div>
      ) : null}
      <div className="space-y-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="আপনার মন্তব্য লিখুন..."
          rows={4}
          className="w-full bg-[#111118] text-[#E2E8F0] placeholder-[#64748B] border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors resize-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#E53E3E] text-white px-6 py-2.5 rounded text-sm hover:bg-red-700 transition-colors"
        >
          মন্তব্য পাঠান
        </button>
      </div>
    </section>
  );
}