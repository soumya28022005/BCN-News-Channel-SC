import Link from 'next/link';
import { timeAgo } from '../../lib/utils';

export default function RelatedArticles({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <div>
      <div className="red-line mb-4">
        <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>সম্পর্কিত সংবাদ</h3>
      </div>
      <div className="space-y-4">
        {articles.slice(0, 5).map((a: any) => (
          <Link key={a.id} href={`/news/${a.slug}`} className="group flex gap-3 items-start">
            <div className="w-20 h-16 shrink-0 bg-[#1E1E2E] rounded overflow-hidden">
              {a.thumbnail ? (
                <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs">BCN</div>
              )}
            </div>
            <div>
              <h4 className="text-xs text-[#E2E8F0] group-hover:text-[#E53E3E] transition-colors line-clamp-3 leading-snug">{a.title}</h4>
              <p className="text-xs text-[#64748B] mt-1">{timeAgo(a.publishedAt || a.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}