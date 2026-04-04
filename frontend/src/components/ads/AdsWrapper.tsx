'use client';

import { usePathname } from 'next/navigation';
import SponsorPopup from '../news/SponsorPopup';
import BottomStickyAd from './BottomStickyAd';
import TopBannerAd from './TopBannerAd';

export default function AdsWrapper() {
  const pathname = usePathname();

  // URL e 'newsroom-bcn-2024' ba 'admin' thakle kono ad dekhabe na
  if (pathname?.includes('/newsroom-bcn-2024') || pathname?.includes('/admin')) {
    return null;
  }

  return (
    <>
      <TopBannerAd />
      <SponsorPopup />
      <BottomStickyAd />
    </>
  );
}