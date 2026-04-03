import SharedNewsLayout from '../components/news/SharedNewsLayout';
import SponsorPopup from '../components/news/SponsorPopup';
import TopBannerAd from '../components/ads/TopBannerAd';
import BottomStickyAd from '../components/ads/BottomStickyAd';
import { serverGet } from '../lib/api/server';

export const revalidate = 60;

async function getArticles() {
  const data = await serverGet<{ data?: any[] }>('/articles?status=PUBLISHED&limit=20', 60);
  return data?.data || [];
}

async function getBreaking() {
  const data = await serverGet<{ data?: any[] }>('/articles/breaking', 30);
  return data?.data || [];
}

async function getTrending() {
  const data = await serverGet<{ data?: any[] }>('/articles/trending', 120);
  return data?.data || [];
}

export default async function HomePage() {
  const [articles, breaking, trending] = await Promise.all([
    getArticles(),
    getBreaking(),
    getTrending(),
  ]);

  return (
    <>
      <SponsorPopup />
      <TopBannerAd />
      <SharedNewsLayout articles={articles} breaking={breaking} trending={trending} />
      <BottomStickyAd />
    </>
  );
}