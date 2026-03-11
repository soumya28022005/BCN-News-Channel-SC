'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const categories = [
  { name: 'বাংলা', slug: 'bengal' },
  { name: 'রাজনীতি', slug: 'politics' },
  { name: 'ক্রীড়া', slug: 'sports' },
  { name: 'বিনোদন', slug: 'entertainment' },
  { name: 'ব্যবসা', slug: 'business' },
  { name: 'প্রযুক্তি', slug: 'technology' },
  { name: 'আন্তর্জাতিক', slug: 'international' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setToday(now.toLocaleDateString('bn-BD', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }));
      setTime(now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    setMounted(true);
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/50' : ''}`}>
      {/* Top bar */}
      <div className="bg-[#0A0A0F] border-b border-[#1E1E2E] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#64748B]">
          <span>{mounted ? today : ''}</span>
          <span className="font-mono">{mounted ? time : ''}</span>
        </div>
      </div>

      {/* Logo bar */}
      <div className="bg-[#0A0A0F] border-b border-[#E53E3E]/30 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-lg rounded-sm">
                BCN
              </div>
              <div>
                <div className="font-bold text-white text-xl tracking-tight leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                  The Bengal Chronicle Network
                </div>
                <div className="text-[10px] text-[#64748B] tracking-widest uppercase mt-0.5">
                  বাংলার কণ্ঠস্বর
                </div>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/search" className="text-[#64748B] hover:text-white transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button
              className="md:hidden text-[#64748B] hover:text-white transition-colors p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-[#111118] border-b border-[#1E1E2E]">
        <div className="max-w-7xl mx-auto px-4">
          <ul className={`${menuOpen ? 'flex flex-col py-2' : 'hidden md:flex'} items-start md:items-center gap-0`}>
            <li>
              <Link href="/" className="block px-4 py-3 text-sm text-[#E2E8F0] hover:text-[#E53E3E] transition-colors font-medium">
                হোম
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-3 text-sm text-[#94A3B8] hover:text-[#E53E3E] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/trending" className="block px-4 py-3 text-sm text-[#F6AD55] hover:text-[#E53E3E] transition-colors">
                🔥 ট্রেন্ডিং
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}