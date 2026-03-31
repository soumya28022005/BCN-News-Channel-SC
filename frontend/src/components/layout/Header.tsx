'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '@/components/layout/logo/log.png';
import { categories } from '@/lib/categories';

// আপনার বলা ৭টা ফিক্সড ক্যাটাগরি
const mainCategories = [
  { name: 'রাজনীতি', slug: 'politics' },
  { name: 'পশ্চিমবঙ্গ', slug: 'westbengal' },
  { name: 'শিক্ষা', slug: 'education' },
  { name: 'বিনোদন', slug: 'entertainment' },
  { name: 'সরকারি প্রকল্প', slug: 'govt-schemes' },
  { name: 'চাকরি', slug: 'jobs' },
  { name: 'খেলাধুলা', slug: 'sports' },
];

// অ্যাডমিন বা অন্য এক্সট্রা ক্যাটাগরি (যেগুলো 'আরও' ড্রপডাউনে থাকবে)
const moreCategories = [
  { name: 'বাংলা', slug: 'bengal' },
  { name: 'ব্যবসা', slug: 'business' },
  { name: 'প্রযুক্তি', slug: 'technology' },
  { name: 'আন্তর্জাতিক', slug: 'international' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [time, setTime] = useState('');
  const [dark, setDark] = useState(false);

  // Next.js রাউট (পেজ) চেঞ্জ ট্র্যাক করার জন্য
  const pathname = usePathname();


  const isActive = (path: string) => pathname === path;

  // থিম ফিক্স: পেজ চেঞ্জ হলেও থিম ঠিক থাকবে
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('bcn-theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        setDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDark(false);
      }
    };
    checkTheme();
  }, [pathname]);

  // সময় এবং স্ক্রল 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    
    const updateTime = () => {
      const now = new Date();
      setToday(now.toLocaleDateString('bn-BD', { weekday:'long', year:'numeric', month:'long', day:'numeric' }));
      setTime(now.toLocaleTimeString('bn-BD', { hour:'2-digit', minute:'2-digit' }));
    };
    updateTime();
    setMounted(true);
    const id = setInterval(updateTime, 60000);
    
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id); };
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (dark) {
      html.classList.remove('dark');
      localStorage.setItem('bcn-theme', 'light');
      setDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('bcn-theme', 'dark');
      setDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.1)' : 'none',
      }}>

      {/* Ticker bar */}
      <div style={{ background:'var(--bg3)', borderBottom:'1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-7">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase" style={{ color:'var(--gold)' }}>
              <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background:'#DC2626' }} />
              LIVE
            </span>
            <span className="text-[11px]" style={{ color:'var(--muted)' }}>{mounted ? today : ''}</span>
          </div>
          <span className="font-mono text-[11px]" style={{ color:'var(--gold)', opacity:0.8 }}>{mounted ? time : ''}</span>
        </div>
      </div>

      {/* Logo row */}
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--gold-line)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between"
  style={{
    background: 'linear-gradient(90deg, rgba(212,175,55,0.15), transparent)',
    borderBottom: '1px solid rgba(212,175,55,0.2)'
  }}>
          <Link href="/">
            {/* লোগো ফিক্স: ফিল্টার (filter) সরিয়ে দিয়েছি যাতে আসল রং থাকে */}
            <Image src={logo} alt="BCN" height={90} priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme}
              className="p-2 rounded-full transition-colors"
              style={{ color:'var(--muted)', background:'var(--bg3)' }}
              aria-label="Theme toggle">
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link href="/search" className="p-2 rounded-full transition-colors" style={{ color:'var(--muted)', background:'var(--bg3)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button className="md:hidden p-2 rounded-full transition-colors"
              style={{ color:'var(--muted)', background:'var(--bg3)' }}
              onClick={() => setMenuOpen(!menuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>
                {/* gap add betwwen nav and photo   do 60 */}
      <div className="gold-line opacity-60" />

      {/* Nav */}
      <div style={{ background:'var(--bg2)' }}>
        <div className="block px-4 py-3 text-sm transition-all hover:text-[var(--gold)] hover:scale-105">
          
          <ul className="hidden md:flex items-center">
            <li><Link
  href="/"
  className="block px-4 py-3 text-sm font-semibold transition-all"
  style={{
    color: isActive('/') ? 'var(--gold)' : 'var(--text)',
  }}
>
  হোম
</Link></li>
            
            {mainCategories.map(cat => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className="block px-4 py-3 text-sm transition-colors hover:text-[var(--gold)]" style={{
  color: pathname.includes(cat.slug) ? 'var(--gold)' : 'var(--muted)'
}}>{cat.name}</Link>
              </li>
            ))}
            
            {moreCategories.length > 0 && (
              <li className="relative group">
                <button className="flex items-center gap-1 px-4 py-3 text-sm transition-colors hover:text-[var(--gold)]" style={{ color:'var(--muted)' }}>
                  আরও
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-52 rounded-xl py-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
  style={{
    background: 'rgba(15,33,71,0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(212,175,55,0.2)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    zIndex: 100,
  }}>
                  {moreCategories.map((cat) => (
                    <Link key={cat.slug} href={`/category/${cat.slug}`} className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--bg3)] hover:text-[var(--gold)]" style={{ color:'var(--text)' }}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </li>
            )}

            <li className="ml-auto">
              <Link href="/trending" className="block px-4 py-3 text-sm font-semibold" style={{ color:'var(--gold)' }}>🔥 ট্রেন্ডিং</Link>
            </li>
          </ul>

          {menuOpen && (
            <ul className="flex flex-col py-2 md:hidden max-h-[80vh] overflow-y-auto">
              <li><Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold border-b" style={{ color:'var(--text)', borderColor:'var(--border)' }}>হোম</Link></li>
              
              {mainCategories.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm border-b" style={{ color:'var(--muted)', borderColor:'var(--border)' }}>{cat.name}</Link>
                </li>
              ))}

              {moreCategories.length > 0 && (
                <li>
                  <button onClick={() => setMoreOpen(!moreOpen)} className="w-full flex justify-between items-center px-4 py-3 text-sm border-b" style={{ color:'var(--muted)', borderColor:'var(--border)' }}>
                    আরও
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {moreOpen && (
                    <ul className="bg-[var(--bg3)]">
                      {moreCategories.map((cat) => (
                        <li key={cat.slug}>
                          <Link href={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)} className="block px-8 py-3 text-sm border-b" style={{ color:'var(--text2)', borderColor:'var(--border)' }}>
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}

              <li><Link href="/trending" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold" style={{ color:'var(--gold)' }}>🔥 ট্রেন্ডিং</Link></li>
            </ul>
          )}
        </div>
      </div>
      <div className="gold-line opacity-30" />
    </header>
  );
}

// this is my Header.tsx