'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

const getValidUrl = (url?: string) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};

export default function SponsorPopup() {
  const pathname = usePathname();
  const [sponsor, setSponsor] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  
  const showRef = useRef(show);
  useEffect(() => { showRef.current = show; }, [show]);

  useEffect(() => {
    // Admin panel e API call o jeno na hoy tai ekhane check kora holo
    if (pathname?.includes('/newsroom-bcn-2024') || pathname?.includes('/admin')) return;

    const checkAndShowAd = async () => {
      if (showRef.current) return;
      
      const lastShown = localStorage.getItem('bcn_last_popup_time');
      const now = Date.now();
      
      const tenMinutes = 3 * 1000; // ১০ মিনিট thik kor

      if (!lastShown || now - parseInt(lastShown) >= tenMinutes) {
        try {
          const res = await api.get<any>(`/sponsor?_t=${now}`);
          const adsArray = res?.data?.data || res?.data || res || [];
          const activePopups = adsArray.filter((ad: any) => ad.position === 'POPUP' && ad.isActive);
          
          if (activePopups && activePopups.length > 0) {
            const randomAd = activePopups[Math.floor(Math.random() * activePopups.length)];
            setSponsor(randomAd);
            setTimeLeft(randomAd.duration || 5); 
            setShow(true);
            localStorage.setItem('bcn_last_popup_time', now.toString());
          }
        } catch (err) {
          console.error("Popup fetch error", err);
        }
      }
    };

    checkAndShowAd();
    const interval = setInterval(checkAndShowAd, 30000); 
    return () => clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    if (!show) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, timeLeft]);

  // Jodiyo AdsWrapper theke null hobe, tobuo extra check
  if (pathname?.includes('/newsroom-bcn-2024') || pathname?.includes('/admin')) return null;
  if (!show || !sponsor) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity animate-in fade-in zoom-in-95 duration-500"
      style={{ background: 'rgba(10,26,58,0.75)', backdropFilter: 'blur(14px)' }}>
      <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-500"
        style={{ border: '1px solid rgba(212,175,55,0.4)', background: '#0A0A0F' }}>
        <a href={getValidUrl(sponsor.linkUrl)} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
          <img src={sponsor.imageUrl} alt="Sponsor" className="w-full h-auto max-h-[80vh] object-contain bg-black transition-transform duration-500 hover:scale-[1.02]" />
        </a>
        <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full shadow-lg"
          style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', backdropFilter: 'blur(4px)' }}>
          Sponsored
        </div>
        <button
          disabled={timeLeft > 0}
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 px-6 py-2 rounded-full text-sm font-bold transition-all shadow-2xl z-50 disabled:opacity-80 disabled:cursor-not-allowed"
          style={{
            background: timeLeft > 0 ? 'rgba(15,33,71,0.9)' : 'linear-gradient(135deg, #D4AF37, #FFC857)',
            color: timeLeft > 0 ? '#7A86B6' : '#0A1A3A',
            border: timeLeft > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}
        >
          {timeLeft > 0 ? `অপেক্ষা করুন ${timeLeft}s...` : '✕ Close Ad'}
        </button>
      </div>
    </div>
  );
}