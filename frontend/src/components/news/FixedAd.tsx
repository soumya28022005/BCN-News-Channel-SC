'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function FixedAd() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // ✅ FIX 1: Cache busting to instantly fetch new ads after submission
        const res = await api.get<any>(`/sponsor?_t=${Date.now()}`);
        const sidebarAds = res.data?.filter((ad: any) => ad.position === 'SIDEBAR' && ad.isActive) || [];
        
        // ✅ FIX 2: Removed the `if(length > 0)` check. 
        // We MUST update state even if empty, so deleted ads disappear from UI!
        setSponsors(sidebarAds);
      } catch (err) {
        console.error("Ad fetch error", err);
      }
    };
    fetchSponsors();
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-6">
      {sponsors.map((sponsor) => (
        <div key={sponsor.id} className="relative rounded-xl overflow-hidden shadow-xl border transition-colors hover:border-[#D4AF37]/50" 
             style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
          
          <div className="absolute top-0 right-0 bg-black/60 backdrop-blur-md px-2 py-1 rounded-bl-lg z-10 border-b border-l border-white/10">
            <span className="text-[9px] uppercase tracking-widest text-white/60 font-mono">Advertisement</span>
          </div>

          <a 
            href={ensureAbsoluteUrl(sponsor.linkUrl)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block relative group"
          >
            <img 
              src={sponsor.imageUrl} 
              alt={sponsor.title || "Ad"} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </a>
        </div>
      ))}
    </div>
  );
}