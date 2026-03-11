import Link from 'next/link';
import { timeAgo } from '../../lib/utils';
import ArticleCard from './ArticleCard';

interface LatestNewsProps {
  articles: any[];
}

export default function LatestNews({ articles }: LatestNewsProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="red-line mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
          সর্বশেষ সংবাদ
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {articles.map((article: any) => (
          <ArticleCard key={article.id} article={article} variant="default" />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          href="/search"
          className="inline-block border border-[#E53E3E] text-[#E53E3E] px-8 py-3 rounded text-sm hover:bg-[#E53E3E] hover:text-white transition-colors"
        >
          আরও সংবাদ দেখুন
        </Link>
      </div>
    </section>
  );
}