'use client';
import { useState, useEffect } from 'react';

export default function FixedAd() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${API}/sponsor`);
        
        if (!res.ok) throw new Error('Backend responded with an error');
        
        const json = await res.json();
        // Handle both standard arrays [{},{}] and wrapped objects { data: [{},{}] }
        const adsArray = json.data || json; 

        if (Array.isArray(adsArray)) {
          const activeAds = adsArray.filter((ad: any) => ad.isActive);
          setSponsors(activeAds);
        }
      } catch (error) {
        console.warn("⚠️ Ad System: Could not fetch sponsors from backend.", error);
        
        // ✨ FALLBACK AD: Shows this if backend is down so your UI doesn't break
        setSponsors([{
          id: 'fallback-1',
          isActive: true,
          imageUrl: 'https://via.placeholder.com/300x250/1a1a1a/c9a84c?text=Your+Ad+Here',
          linkUrl: '#'
        }]);
      }
    };
    
    fetchSponsors();
  }, []);

  if (!sponsors.length) return null;

  return (
    <div className="flex flex-col gap-6 my-6">
      {sponsors.map((ad) => (
        <div key={ad.id} className="relative rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <div className="absolute top-2 right-2 text-[9px] px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>AD</div>
          <a href={ad.linkUrl !== '#' ? ad.linkUrl : undefined} target="_blank" rel="noreferrer">
            <img src={ad.imageUrl} alt="Advertisement" className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105" />
          </a>
        </div>
      ))}
    </div>
  );
}