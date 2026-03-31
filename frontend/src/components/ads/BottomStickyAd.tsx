'use client';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from '../../config/ads.config';

export default function BottomStickyAd() {
  const [ad, setAd] = useState<any>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // If AdSense is enabled, we don't need to fetch custom ads
    if (AD_CONFIG.ADSENSE_ENABLED) return;

    const fetchAd = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${API}/sponsor`);
        
        if (!res.ok) throw new Error('Backend error');
        
        const json = await res.json();
        const adsArray = json.data || json;

        if (Array.isArray(adsArray)) {
          const bottomAd = adsArray.find((a: any) => a.position === 'BOTTOM' && a.isActive);
          if (bottomAd) setAd(bottomAd);
        }
      } catch (error) {
        console.warn("⚠️ Bottom Ad System: Could not fetch sponsors.", error);
        
        // ✨ FALLBACK AD: Shows this if backend is down
        setAd({
          id: 'fallback-bottom',
          isActive: true,
          imageUrl: 'https://via.placeholder.com/720x80/1a1a1a/c9a84c?text=Your+Bottom+Banner+Ad+Here',
          linkUrl: '#'
        });
      }
    };
    fetchAd();
  }, []);

  if (!visible) return null;
  if (!AD_CONFIG.ADSENSE_ENABLED && !ad) return null;

  return (
    <>
      {/* Spacer to prevent content from hiding behind the sticky ad */}
      <div className="h-[80px] lg:hidden" />
      
      {/* Fixed Container - Only visible on Mobile/Tablet */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center p-2 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="relative w-full max-w-[720px] rounded-lg overflow-hidden bg-white dark:bg-black">
          
          {/* Close Button */}
          <button 
            onClick={() => setVisible(false)} 
            className="absolute top-1 right-1 z-10 text-[10px] px-2 py-1 bg-black/70 hover:bg-black text-white rounded shadow"
            aria-label="Close Ad"
          >
            ✕ Close
          </button>

          {/* Ad Content */}
          {AD_CONFIG.ADSENSE_ENABLED ? (
            <ins className="adsbygoogle"
                 style={{ display: 'inline-block', width: '100%', height: '80px' }}
                 data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID}
                 data-ad-slot="YOUR_BOTTOM_AD_SLOT_ID"></ins>
          ) : (
            <a href={ad.linkUrl !== '#' ? ad.linkUrl : undefined} target="_blank" rel="noreferrer" className="block w-full">
              <img src={ad.imageUrl} alt="Advertisement" className="w-full h-[80px] object-contain" />
            </a>
          )}
        </div>
      </div>
    </>
  );
}