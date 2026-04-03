'use client';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from '../../config/ads.config';
import { api } from '../../lib/api';

export default function TopBannerAd() {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (AD_CONFIG.ADSENSE_ENABLED) return;
    const fetchAd = async () => {
      try {
        const res = await api.get<any>('/sponsor');
        const adsArray = res?.data?.data || res?.data || res || [];
        if (Array.isArray(adsArray)) {
          const topAds = adsArray.filter((a: any) => a.position === 'TOP' && a.isActive);
          if (topAds.length > 0) setAds(topAds);
        }
      } catch (error) {
        console.warn("Top Ad fetch failed", error);
      }
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

  if (!visible) return null;
  if (!AD_CONFIG.ADSENSE_ENABLED && ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div className="sticky top-[113px] md:top-[125px] z-[45] w-full flex justify-center mb-4 transition-opacity duration-500 fade-in px-0 md:px-4">
      
      {/* Container */}
      <div className="w-full md:max-w-[728px] relative flex flex-col items-center bg-gray-50 dark:bg-[#0A1A3A] shadow-md md:rounded-lg border-b md:border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={() => setVisible(false)} 
          className="absolute top-0 right-0 z-50 bg-black/60 hover:bg-black text-white text-[10px] px-3 py-1 md:rounded-bl-lg transition-colors shadow"
          title="বিজ্ঞাপনটি বন্ধ করুন"
        >
          ✕ Close
        </button>

        {/* Ad Label */}
        <span className="text-[8px] text-white uppercase tracking-widest absolute top-0 left-0 font-bold opacity-80 z-10 bg-black/40 px-2 py-0.5 rounded-br-lg pointer-events-none">
          Advertisement
        </span>

        {AD_CONFIG.ADSENSE_ENABLED ? (
          <div className="w-full flex justify-center py-1">
            <ins className="adsbygoogle"
                 style={{ display: 'inline-block', width: '100%', height: '60px' }}
                 data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID}></ins>
          </div>
        ) : (
          <a href={currentAd?.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full flex justify-center items-center py-1">
            {/* ✅ FIX: object-cover er bodole object-contain dewa hoyeche. Ete image fatbe na aur original ratio te thakbe. */}
            <img 
              src={currentAd?.imageUrl} 
              alt="Advertisement" 
              className="w-full max-w-[728px] h-[60px] md:h-[75px] object-contain transition-transform hover:opacity-90 mx-auto" 
            />
          </a>
        )}
      </div>
    </div>
  );
}