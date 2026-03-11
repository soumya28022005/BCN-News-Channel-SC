import Link from 'next/link';
import { timeAgo, formatNumber } from '../../lib/utils';

interface TrendingSectionProps {
  articles: any[];
}

export default function TrendingSection({ articles }: TrendingSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section>
      <div className="red-line mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
          🔥 ট্রেন্ডিং
        </h2>
      </div>
      <div className="space-y-3">
        {articles.slice(0, 8).map((article: any, i: number) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group flex gap-3 items-start py-3 border-b border-[#1E1E2E] last:border-0"
          >
            <span className="text-2xl font-bold text-[#1E1E2E] group-hover:text-[#E53E3E] transition-colors font-mono w-8 shrink-0 leading-none mt-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              {article.category && (
                <span className="text-[#E53E3E] text-xs font-medium uppercase">{article.category.name}</span>
              )}
              <h4 className="text-sm text-[#E2E8F0] group-hover:text-[#E53E3E] transition-colors leading-snug mt-0.5">
                {article.title}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                <span>👁 {formatNumber(article.viewCount)}</span>
                <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/trending"
        className="block text-center text-[#E53E3E] text-xs mt-4 hover:underline"
      >
        সব ট্রেন্ডিং দেখুন →
      </Link>
    </section>
  );
}