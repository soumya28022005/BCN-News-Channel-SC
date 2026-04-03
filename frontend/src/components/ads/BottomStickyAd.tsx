'use client';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from '../../config/ads.config';
import { api } from '../../lib/api';

export default function BottomStickyAd() {
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
          const bottomAds = adsArray.filter((a: any) => a.position === 'BOTTOM' && a.isActive);
          if (bottomAds.length > 0) setAds(bottomAds);
        }
      } catch (error) {
        console.warn("Bottom Ad fetch failed", error);
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
    <>
      <div className="h-[80px]" /> {/* Spacer */}
      
      <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="relative w-full max-w-[720px] rounded-lg overflow-hidden bg-white dark:bg-black transition-opacity duration-500">
          
          <button 
            onClick={() => setVisible(false)} 
            className="absolute top-1 right-1 z-10 text-[10px] px-2 py-1 bg-black/70 hover:bg-black text-white rounded shadow"
          >
            ✕ Close
          </button>

          {AD_CONFIG.ADSENSE_ENABLED ? (
            <ins className="adsbygoogle"
                 style={{ display: 'inline-block', width: '100%', height: '80px' }}
                 data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID}></ins>
          ) : (
            <a href={currentAd?.linkUrl || '#'} target="_blank" rel="noreferrer" className="block w-full">
              <img src={currentAd?.imageUrl} alt="Advertisement" className="w-full h-[80px] object-contain" />
            </a>
          )}
        </div>
      </div>
    </>
  );
}