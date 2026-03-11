import Link from 'next/link';
import { timeAgo } from '../../lib/utils';

export default function FeaturedStory({ article }: { article: any }) {
  if (!article) return null;
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <div className="relative h-64 bg-[#111118] rounded-lg overflow-hidden">
        {article.thumbnail ? (
          <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-[#1E1E2E]" />
        )}
        <div className="absolute inset-0 img-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {article.category && <span className="text-[#E53E3E] text-xs uppercase font-medium">{article.category.name}</span>}
          <h3 className="text-white font-bold text-base leading-snug mt-1 group-hover:text-[#F6AD55] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
            {article.title}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">{timeAgo(article.publishedAt || article.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}