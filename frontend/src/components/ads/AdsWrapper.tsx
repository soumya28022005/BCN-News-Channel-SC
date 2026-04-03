'use client';

import { usePathname } from 'next/navigation';
import SponsorPopup from '../news/SponsorPopup';
import BottomStickyAd from './BottomStickyAd';
import TopBannerAd from './TopBannerAd'; // ✅ FIX: Top Banner ইমপোর্ট করা হলো

export default function AdsWrapper() {
  const pathname = usePathname();

  // ইউজার অ্যাডমিন প্যানেলে থাকলে কোনো অ্যাড দেখাবে না
  if (pathname?.startsWith('/newsroom-bcn-2024')) {
    return null;
  }

  return (
    <>
      {/* ✅ FIX: হেডারের ঠিক নিচেই Top Banner দেখাবে */}
      <TopBannerAd />
      
      <SponsorPopup />
      <BottomStickyAd />
    </>
  );
}