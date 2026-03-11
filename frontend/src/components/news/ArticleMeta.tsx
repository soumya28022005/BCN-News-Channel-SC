import Link from 'next/link';
import { timeAgo, formatNumber } from '../../lib/utils';

export default function ArticleMeta({ article }: { article: any }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] py-4 border-y border-[#1E1E2E]">
      {article.author && (
        <Link href={`/author/${article.author.username}`} className="flex items-center gap-2 hover:text-[#E53E3E] transition-colors">
          <div className="w-7 h-7 rounded-full bg-[#E53E3E] flex items-center justify-center text-white text-xs font-bold">
            {article.author.name?.charAt(0)}
          </div>
          <span className="font-medium text-[#E2E8F0]">{article.author.name}</span>
        </Link>
      )}
      <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
      <span>👁 {formatNumber(article.viewCount)}</span>
      {article.readingTime && <span>📖 {article.readingTime} মিনিট</span>}
    </div>
  );
}