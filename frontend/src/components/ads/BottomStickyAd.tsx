'use client';
import { useEffect, useState } from 'react';

export default function BottomStickyAd() {
  const [ad, setAd] = useState<any>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
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

  if (!ad || !visible) return null;

  return (
    <>
      <div className="h-[80px]" />
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-2" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="relative w-full max-w-[720px] rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <button onClick={() => setVisible(false)} className="absolute top-1 right-1 text-xs px-2 py-1 bg-black/60 text-white rounded">✕</button>
          <a href={ad.linkUrl !== '#' ? ad.linkUrl : undefined} target="_blank" rel="noreferrer">
            <img src={ad.imageUrl} alt="Advertisement" className="w-full h-[80px] object-cover" />
          </a>
        </div>
      </div>
    </>
  );
}