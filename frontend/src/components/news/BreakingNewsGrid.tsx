import Link from 'next/link';
import { timeAgo } from '../../lib/utils';

export default function BreakingNewsGrid({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span className="bg-[#E53E3E] text-white text-xs px-3 py-1 rounded uppercase font-bold tracking-wider breaking-pulse">ব্রেকিং</span>
        <div className="h-px flex-1 bg-[#1E1E2E]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.slice(0, 4).map((a: any) => (
          <Link key={a.id} href={`/news/${a.slug}`} className="group flex gap-3 bg-[#111118] border border-[#E53E3E]/20 rounded-lg p-3 hover:border-[#E53E3E]/60 transition-colors">
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-[#E2E8F0] line-clamp-3 leading-snug group-hover:text-[#E53E3E] transition-colors">
                {a.title}
              </h4>
              <p className="text-xs text-[#64748B] mt-2">{timeAgo(a.publishedAt || a.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}