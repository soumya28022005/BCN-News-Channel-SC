import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SharedNewsLayout from '../components/news/SharedNewsLayout';
import SponsorPopup from '../components/news/SponsorPopup'; 

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function getArticles() {
  try {
    const res = await fetch(`${API}/articles?status=PUBLISHED&limit=20`, { next: { revalidate: 60 } });
    return (await res.json()).data || [];
  } catch { return []; }
}

async function getBreaking() {
  try {
    const res = await fetch(`${API}/articles/breaking`, { next: { revalidate: 30 } });
    return (await res.json()).data || [];
  } catch { return []; }
}

async function getTrending() {
  try {
    const res = await fetch(`${API}/articles/trending`, { next: { revalidate: 120 } });
    return (await res.json()).data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [articles, breaking, trending] = await Promise.all([getArticles(), getBreaking(), getTrending()]);

  return (
    <>
      <SponsorPopup /> 
      <Header />
      <SharedNewsLayout 
        articles={articles} 
        breaking={breaking} 
        trending={trending} 
      />
      <Footer />
    </>
  );
}