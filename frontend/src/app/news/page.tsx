// frontend/src/app/news/page.tsx
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import LatestNews from '../../components/news/LatestNews';

export default function NewsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">সব খবর</h1>
          <LatestNews />
        </div>
      </main>
      <Footer />
    </>
  );
}