import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import SharedNewsLayout from '../../../components/news/SharedNewsLayout';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function getCategoryArticles(slug: string) {
  try {
    const res = await fetch(`${API}/articles?category=${slug}&status=PUBLISHED&limit=20`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getCategory(slug: string) {
  try {
    const res = await fetch(`${API}/categories/${slug}`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.data || null;
  } catch { return null; }
}

async function getTrending() {
  try {
    const res = await fetch(`${API}/articles/trending`, { next: { revalidate: 120 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [articles, category, trending] = await Promise.all([
    getCategoryArticles(slug),
    getCategory(slug),
    getTrending()
  ]);

  const categoryName = category?.name || slug;

  return (
    <>
      <Header />
      {/* By passing pageTitle, the component knows to show the Category banner.
        It uses the exact same UI structure as your Homepage!
      */}
      <SharedNewsLayout 
        articles={articles} 
        trending={trending} 
        pageTitle={categoryName} 
      />
      <Footer />
    </>
  );
}