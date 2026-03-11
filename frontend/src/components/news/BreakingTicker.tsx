'use client';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
}

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-[#E53E3E] text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <span className="bg-white text-[#E53E3E] font-bold text-xs px-3 py-1 shrink-0 mx-4 uppercase tracking-wider">
          ব্রেকিং
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-animation whitespace-nowrap text-sm font-medium">
            {articles.map((a, i) => (
              <Link key={a.id} href={`/news/${a.slug}`} className="hover:underline">
                {i > 0 && <span className="mx-6 opacity-60">◆</span>}
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}