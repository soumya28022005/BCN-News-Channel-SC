import Header from '@/components/layout/Header';
// 🔹 নতুন কম্পোনেন্ট ইম্পোর্ট করা হলো
import MobileTicker from '@/components/layout/Header/MobileTicker'; 
import SharedNewsLayout from '@/components/news/SharedNewsLayout';
import { apiUrl } from '@/lib/config';

async function getArticles() {
  const res = await fetch(apiUrl('/articles'), { next: { revalidate: 30 } });
  if (!res.ok) return { data: [], pagination: {} };
  return res.json();
}

async function getBreaking() {
  const res = await fetch(apiUrl('/articles/breaking'), { next: { revalidate: 60 } });
  if (!res.ok) return { data: [], pagination: {} };
  return res.json();
}

async function getTrending() {
  const res = await fetch(apiUrl('/articles/trending'), { next: { revalidate: 120 } });
  if (!res.ok) return { data: [], pagination: {} };
  return res.json();
}

export default async function HomePage() {
  const [allRes, breakingRes, trendingRes] = await Promise.all([
    getArticles(),
    getBreaking(),
    getTrending(),
  ]);

  const articles = allRes.data || [];
  const breaking = breakingRes.data || [];
  const trending = trendingRes.data || [];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* 🔹 মোবাইলের জন্য ফ্ল্যাশ নিউজ Ticker হেডারের ঠিক নিচে, হিরো সেকশনের উপরে দেওয়া হলো */}
      <MobileTicker />

      <main className="flex-1">
        <SharedNewsLayout articles={articles} breaking={breaking} trending={trending} />
      </main>
    </div>
  );
}