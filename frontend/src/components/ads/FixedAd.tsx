'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function FixedAd() {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get<any>('/sponsor');
        const adsArray = res?.data?.data || res?.data || res || [];
        
        // ✅ FIX: এখানে শুধুমাত্র "SIDEBAR" অ্যাডগুলো ফিল্টার করা হলো
        const sidebarAds = adsArray.filter((a: any) => a.position === 'SIDEBAR' && a.isActive);
        
        if (sidebarAds.length > 0) setAds(sidebarAds);
      } catch (error) {}
    };
    fetchAd();
  }, []);

  // একাধিক সাইডবার অ্যাড থাকলে ৫ সেকেন্ড পর পর অ্যানিমেশনসহ পরিবর্তন হবে
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
    <div className="my-8 w-full transition-opacity duration-500 fade-in">
      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 text-center font-bold">Advertisement</div>
      <a href={currentAd?.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500" style={{ border: '1px solid var(--border)' }}>
        <img src={currentAd?.imageUrl} alt="Ad" className="w-full h-auto object-cover" />
      </a>
    </div>
  );
}