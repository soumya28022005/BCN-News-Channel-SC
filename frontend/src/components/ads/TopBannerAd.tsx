'use client';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from '../../config/ads.config';
import { api } from '../../lib/api';

export default function TopBannerAd() {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    if (AD_CONFIG.ADSENSE_ENABLED) return; 

    const fetchAd = async () => {
      try {
        // ✅ Using global `api` client which handles dynamic mobile IPs
        const res = await api.get<any>('/sponsor');
        const adsArray = res.data || res;
        const topAd = adsArray.find((a: any) => a.position === 'TOP' && a.isActive);
        if (topAd) setAd(topAd);
      } catch (error) {
        console.warn("Top Ad fetch failed", error);
      }
    };
    fetchAd();
  }, []);

  if (AD_CONFIG.ADSENSE_ENABLED) {
    return (
      <div className="w-full flex justify-center my-4 overflow-hidden">
        <ins className="adsbygoogle"
             style={{ display: 'inline-block', width: '728px', height: '90px' }}
             data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID}
             data-ad-slot="XXXXXXXXXX"></ins>
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className="w-full flex justify-center my-6 px-4">
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block max-w-[728px] w-full">
        <img src={ad.imageUrl} alt="Advertisement" className="w-full h-auto max-h-[120px] object-contain rounded-lg border shadow-sm transition-transform hover:opacity-95" style={{ borderColor: 'var(--border)' }} />
      </a>
    </div>
  );
}