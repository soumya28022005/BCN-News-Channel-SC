'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '@/components/layout/logo/log.png';
import { BCN_MAIN_CATEGORIES, BCN_MORE_CATEGORIES } from '@/lib/categories';
import { apiUrl } from '@/lib/config'; 

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [time, setTime] = useState('');
  const [dark, setDark] = useState(false);
  
  const [tickerText, setTickerText] = useState('স্বাগতম বেঙ্গল ক্রনিকল নেটওয়ার্কে - সত্যের সাথে, সবসময়...');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);

    const updateTime = () => {
      const now = new Date();
      setToday(
        now.toLocaleDateString('bn-BD', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      setTime(now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
    };

    const checkTheme = () => {
      const theme = localStorage.getItem('bcn-theme');
      const isDark =
        theme === 'dark' ||
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
      setDark(isDark);
    };

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

    updateTime();
    checkTheme();
    fetchTickerText();
    setMounted(true);

    const timer = setInterval(updateTime, 60000);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !dark;
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('bcn-theme', nextDark ? 'dark' : 'light');
    setDark(nextDark);
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll-left {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-left 25s linear infinite;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}} />

      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        <div style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--gold)' }}
              >
                <span
                  className="live-dot w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: '#DC2626' }}
                />
                LIVE
              </span>
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                {mounted ? today : ''}
              </span>
            </div>
            <span className="font-mono text-[11px]" style={{ color: 'var(--gold)' }}>
              {mounted ? time : ''}
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--gold-line)' }}>
          <div
            className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4"
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.12), transparent)',
            }}
          >
            <Link href="/" aria-label="BCN Home" className="flex-shrink-0">
              <Image 
                src={logo} 
                alt="BCN Logo" 
                height={56} // h-14 equivalent
                width={150} // Provide a rough width to prevent layout shift
                priority 
                sizes="(max-width: 768px) 100px, 150px"
                className="h-14 w-auto object-contain" 
              />
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl bg-[var(--bg3)] border border-[var(--border)] rounded-full overflow-hidden items-center shadow-inner relative h-10">
              <div className="absolute left-0 z-10 h-full flex items-center px-4 rounded-r-full shadow-[2px_0_10px_rgba(0,0,0,0.1)]" style={{ background: 'var(--accent-red)' }}>
                 <span className="text-white text-[11px] font-bold tracking-widest flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                   ফ্ল্যাশ
                 </span>
              </div>
              <div className="flex-1 overflow-hidden ml-20 relative h-full flex items-center">
                <span className="animate-scroll-left text-sm font-medium cursor-pointer" style={{ color: 'var(--text)' }}>
                  {tickerText} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {tickerText}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full"
                style={{ color: 'var(--muted)', background: 'var(--bg3)' }}
                aria-label="Theme toggle"
              >
                {dark ? '☀️' : '🌙'}
              </button>

              <Link
                href="/search"
                className="p-2 rounded-full"
                style={{ color: 'var(--muted)', background: 'var(--bg3)' }}
                aria-label="Search"
              >
                🔍
              </Link>

              <button
                className="md:hidden p-2 rounded-full"
                style={{ color: 'var(--muted)', background: 'var(--bg3)' }}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        <div className="gold-line opacity-60" />

        <nav style={{ background: 'var(--bg2)' }}>
          <div className="max-w-7xl mx-auto px-2">
            <ul className="hidden md:flex items-center">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-3 text-sm font-semibold"
                  style={{ color: isActive('/') ? 'var(--gold)' : 'var(--text)' }}
                >
                  হোম
                </Link>
              </li>

              {BCN_MAIN_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-3 text-sm transition-colors hover:text-[var(--gold)]"
                    style={{
                      color: pathname.includes(cat.slug) ? 'var(--gold)' : 'var(--muted)',
                    }}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}

              <li
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  className="flex items-center gap-1 px-4 py-3 text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  আরও
                </button>

                {moreOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-52 rounded-xl py-2"
                    style={{
                      background: 'rgba(15,33,71,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                      zIndex: 100,
                    }}
                  >
                    {BCN_MORE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-sm hover:text-[var(--gold)]"
                        style={{ color: '#fff' }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              <li className="ml-auto">
                <Link href="/trending" className="block px-4 py-3 text-sm font-semibold" style={{ color: 'var(--gold)' }}>
                  🔥 ট্রেন্ডিং
                </Link>
              </li>
            </ul>

            {menuOpen && (
              <ul className="md:hidden flex flex-col py-2">
                <li>
                  <Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm">
                    হোম
                  </Link>
                </li>

                {BCN_MAIN_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}

                {BCN_MORE_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}