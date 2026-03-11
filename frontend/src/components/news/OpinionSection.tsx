import Link from 'next/link';
import { timeAgo } from '../../lib/utils';

export default function OpinionSection({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="my-10">
      <div className="red-line mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>মতামত</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((a: any) => (
          <Link key={a.id} href={`/news/${a.slug}`} className="group bg-[#111118] border border-[#1E1E2E] rounded-lg p-5 hover:border-[#E53E3E]/40 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#E53E3E] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {a.author?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-[#E2E8F0] font-medium">{a.author?.name}</p>
                <p className="text-xs text-[#64748B]">{a.author?.authorProfile?.title || 'লেখক'}</p>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-[#E2E8F0] line-clamp-3 leading-snug group-hover:text-[#E53E3E] transition-colors">
              {a.title}
            </h4>
            <p className="text-xs text-[#64748B] mt-2">{timeAgo(a.publishedAt || a.createdAt)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}