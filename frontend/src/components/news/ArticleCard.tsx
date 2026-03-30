import Link from 'next/link';
import { timeAgo } from '../../lib/utils';

interface ArticleCardProps {
  article: any;
  variant?: 'default' | 'horizontal' | 'minimal';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-3 card-hover p-3 rounded-l">
        <div className="w-24 h-20 shrink-0 bg-[#1E1E2E] rounded overflow-hidden">
          {article.thumbnail ? (
            <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs">BCN</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {article.category && (
            <span className="text-xs font-medium uppercase"
      style={{ color: 'var(--gold)' }}>{article.category.name}</span>
          )}
          <h3 className="text-sm font-semibold text-[#E2E8F0] line-clamp-2 mt-1 group-hover:text-[#E53E3E] transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">{timeAgo(article.publishedAt || article.createdAt)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-3 items-start py-3 border-b border-[#1E1E2E] last:border-0">
        <div className="flex-1">
          {article.category && (
            <span className="text-xs font-medium uppercase"
      style={{ color: 'var(--gold)' }}>{article.category.name}</span>
          )}
          <h4 className="text-sm text-[#E2E8F0] group-hover:text-[#E53E3E] transition-colors leading-snug mt-0.5">
            {article.title}
          </h4>
          <p className="text-xs text-[#64748B] mt-1">{timeAgo(article.publishedAt || article.createdAt)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug}`} className="group article-card bg-[#111118] rounded-lg overflow-hidden border border-[#1E1E2E] hover:border-[#E53E3E]/40 transition-colors">
      <div className="h-44 bg-[#1E1E2E] overflow-hidden">
        {article.thumbnail ? (
          <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#64748B]">BCN</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {article.isBreaking && (
            <span className="bg-[#E53E3E] text-white text-xs px-2 py-0.5 rounded uppercase font-bold">ব্রেকিং</span>
          )}
          {article.category && (
            <span className="text-xs font-medium uppercase"
      style={{ color: 'var(--gold)' }}>{article.category.name}</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-[#E2E8F0] line-clamp-2 mb-2 group-hover:text-[#E53E3E] transition-colors leading-snug">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>{article.author?.name}</span>
          <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}