'use client';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

export default function SponsorPopup() {
  const [sponsor, setSponsor] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  
  const showRef = useRef(show);
  useEffect(() => { showRef.current = show; }, [show]);

  // Helper function to ensure external links open correctly
  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  useEffect(() => {
    const checkAndShowAd = async () => {
      if (showRef.current) return;
      
      const lastShown = localStorage.getItem('bcn_last_popup_time');
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000; 

      if (!lastShown || now - parseInt(lastShown) >= tenMinutes) {
        try {
          const res = await api.get<any>('/sponsor');
          const activePopups = res.data?.filter((ad: any) => ad.position === 'POPUP' && ad.isActive);
          
          if (activePopups && activePopups.length > 0) {
            const randomAd = activePopups[Math.floor(Math.random() * activePopups.length)];
            setSponsor(randomAd);
            setTimeLeft(randomAd.duration || 5); 
            setShow(true);
            localStorage.setItem('bcn_last_popup_time', now.toString());
          }
        } catch (err) {}
      }
    };

    checkAndShowAd();
    const interval = setInterval(checkAndShowAd, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!show) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, timeLeft]);

  if (!show || !sponsor) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-300"
      style={{ background: 'rgba(10,26,58,0.9)', backdropFilter: 'blur(10px)' }}>
      
      <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-500"
        style={{ border: '1px solid rgba(212,175,55,0.4)', background: '#0A0A0F' }}>
        
        {/* 🔹 FIXED: Link logic added here 🔹 */}
        <a 
          href={ensureAbsoluteUrl(sponsor.linkUrl)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block cursor-pointer"
        >
          <img 
            src={sponsor.imageUrl} 
            alt={sponsor.title || "Sponsor"} 
            className="w-full h-auto max-h-[80vh] object-contain bg-black" 
          />
        </a>

        <div className="absolute top-4 right-4">
          <button
            disabled={timeLeft > 0}
            onClick={() => setShow(false)}
            className="px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md transition-all shadow-2xl"
            style={{ 
              background: timeLeft > 0 ? 'rgba(0,0,0,0.7)' : 'linear-gradient(135deg, #D4AF37, #B8960C)',
              color: timeLeft > 0 ? '#94A3B8' : '#0A1A3A',
              border: timeLeft > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              cursor: timeLeft > 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {timeLeft > 0 ? `অপেক্ষা করুন ${timeLeft}s...` : '✕ Close Ad'}
          </button>
        </div>
      </div>
    </div>
  );
}