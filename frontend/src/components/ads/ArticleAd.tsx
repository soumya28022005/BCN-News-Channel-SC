'use client';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from '../../config/ads.config';

export default function ArticleAd() {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    if (AD_CONFIG.ADSENSE_ENABLED) return;
    const fetchAd = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${API}/sponsor`);
        const json = await res.json();
        const adsArray = json.data || json;
        // Randomly pick one of the inline ads to prevent repetition if multiple exist
        const inlineAds = adsArray.filter((a: any) => a.position === 'ARTICLE_INLINE' && a.isActive);
        if (inlineAds.length > 0) {
          setAd(inlineAds[Math.floor(Math.random() * inlineAds.length)]);
        }
      } catch (error) {}
    };
    fetchAd();
  }, []);

  return (
    <div className="my-8 w-full clear-both bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex justify-center">
      {AD_CONFIG.ADSENSE_ENABLED ? (
        <ins className="adsbygoogle" style={{ display: 'block', textAlign: 'center' }} data-ad-layout="in-article" data-ad-format="fluid" data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID} data-ad-slot="XXXXXXXXXX"></ins>
      ) : ad ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
          <img src={ad.imageUrl} alt="Ad" className="w-full h-auto max-h-[250px] object-cover rounded" />
        </a>
      ) : null}
    </div>
  );
}