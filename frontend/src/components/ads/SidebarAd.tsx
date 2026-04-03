'use client';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from '../../config/ads.config';
import { api } from '../../lib/api';

export default function SidebarAd() {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (AD_CONFIG.ADSENSE_ENABLED) return;
    const fetchAd = async () => {
      try {
        const res = await api.get<any>('/sponsor');
        const adsArray = res?.data?.data || res?.data || res || [];
        if (Array.isArray(adsArray)) {
          const sidebarAds = adsArray.filter((a: any) => a.position === 'SIDEBAR' && a.isActive);
          if (sidebarAds.length > 0) setAds(sidebarAds);
        }
      } catch (error) {}
    };
    fetchAd();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="hidden lg:block sticky top-24 w-full mb-8 transition-opacity duration-500">
      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 text-center">Advertisement</div>
      
      {AD_CONFIG.ADSENSE_ENABLED ? (
        <ins className="adsbygoogle" style={{ display: 'block', width: '300px', height: '600px', margin: '0 auto' }} data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID} data-ad-slot="XXXXXXXXXX"></ins>
      ) : ads.length > 0 ? (
        <a href={ads[currentIndex].linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-md">
          <img src={ads[currentIndex].imageUrl} alt="Ad" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
        </a>
      ) : null}
    </div>
  );
}