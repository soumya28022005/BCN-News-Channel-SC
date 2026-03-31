'use client';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from '../../config/ads.config';

export default function SidebarAd() {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    if (AD_CONFIG.ADSENSE_ENABLED) return;
    const fetchAd = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${API}/sponsor`);
        const json = await res.json();
        const adsArray = json.data || json;
        const sidebarAd = adsArray.find((a: any) => a.position === 'SIDEBAR' && a.isActive);
        if (sidebarAd) setAd(sidebarAd);
      } catch (error) {}
    };
    fetchAd();
  }, []);

  return (
    <div className="hidden lg:block sticky top-24 w-full mb-8">
      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 text-center">Advertisement</div>
      
      {AD_CONFIG.ADSENSE_ENABLED ? (
        <ins className="adsbygoogle" style={{ display: 'block', width: '300px', height: '600px', margin: '0 auto' }} data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID} data-ad-slot="XXXXXXXXXX"></ins>
      ) : ad ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-md">
          <img src={ad.imageUrl} alt="Ad" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
        </a>
      ) : null}
    </div>
  );
}