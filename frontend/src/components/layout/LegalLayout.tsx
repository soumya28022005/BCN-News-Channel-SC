import React from 'react';

export default function LegalLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0A0A0F] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-[#111118] border border-[#1E1E2E] rounded-lg p-8">
        <div className="border-b border-[#1E1E2E] pb-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {title}
          </h1>
          <p className="text-[#94A3B8] text-sm">
            The Bengal Chronicle Network (BCN)
          </p>
        </div>
        <div className="text-[#94A3B8] space-y-4 leading-relaxed text-sm sm:text-base">
          {children}
        </div>
      </div>
    </main>
  );
}