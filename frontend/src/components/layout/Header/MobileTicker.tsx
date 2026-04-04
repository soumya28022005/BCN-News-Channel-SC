'use client';
import { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/config';

export default function MobileTicker() {
  const [tickerText, setTickerText] = useState('স্বাগতম বেঙ্গল ক্রনিকল নেটওয়ার্কে - সত্যের সাথে, সবসময়...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchTickerText = async () => {
      try {
        const res = await fetch(apiUrl('/settings/HEADER_TICKER_TEXT'));
        if (res.ok) {
          const data = await res.json();
          if (data?.value) setTickerText(data.value);
        }
      } catch (error) {
        console.error('Failed to fetch ticker text');
      }
    };
    fetchTickerText();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="md:hidden w-full bg-[#1e293b] border-t border-b border-gray-700 h-10 flex items-center overflow-hidden relative font-sans shadow-lg">

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .ticker-track {
          display: inline-block;
          white-space: nowrap;
          animation: ticker-scroll 120s linear infinite;
          will-change: transform;
        }
      `}} />

      {/* ফ্ল্যাশ লেবেল */}
      <div className="absolute left-0 z-10 h-full flex items-center px-4 rounded-r-full shadow-[2px_0_10px_rgba(0,0,0,0.3)]"
           style={{ background: '#DC2626' }}>
        <span className="text-white text-[10px] font-bold tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          ব্রেকিং নিউজ
        </span>
      </div>

      {/* Scrolling Text */}
      <div className="flex-1 overflow-hidden ml-24 h-full flex items-center">
        <span className="ticker-track text-sm font-medium text-white">
          {tickerText}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{tickerText}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{tickerText}
        </span>
      </div>
    </div>
  );
}