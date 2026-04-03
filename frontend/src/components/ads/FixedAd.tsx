'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const getValidUrl = (url?: string) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};

export default function FixedAd() {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get<any>('/sponsor');
        const adsArray = res?.data?.data || res?.data || res || [];
        
        // SIDEBAR ad gulo filter kora hoche
        const sidebarAds = adsArray.filter((a: any) => a.position === 'SIDEBAR' && a.isActive);
        
        if (sidebarAds.length > 0) setAds(sidebarAds);
      } catch (error) {}
    };
    fetchAd();
  }, []);

  // Multiple ad thakle 5 second por por change hobe
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) return null;
  const currentAd = ads[currentIndex];

  return (
    // ✅ FIX: "sticky top-[120px]" jog kora hoyeche jate scroll korleo eta sidebar-e atke thake
    <div className="sticky top-[120px] my-8 w-full transition-opacity duration-500 fade-in z-30">
      
      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 text-center font-bold opacity-80">
        Advertisement
      </div>

      <a 
        href={getValidUrl(currentAd?.linkUrl)} 
        target="_blank" 
        rel="noopener noreferrer" 
        // ✅ FIX: Top/Bottom banner er moto same color, border aur shadow dewa hoyeche
        className="block w-full max-w-[300px] mx-auto bg-gray-50 dark:bg-[#0A1A3A] rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 group"
      >
        {/* ✅ FIX: object-cover er bodole object-contain kora hoyeche jate image na fate ba na kate */}
        <img 
          src={currentAd?.imageUrl} 
          alt="Advertisement" 
          className="w-full h-auto max-h-[600px] object-contain p-1 mx-auto group-hover:opacity-90 transition-opacity" 
        />
      </a>
      
    </div>
  );
}