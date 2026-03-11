import Link from 'next/link';
import { timeAgo } from '../../lib/utils';
import ArticleCard from './ArticleCard';

interface HeroSectionProps {
  featured: any;
  secondary: any[];
}

export default function HeroSection({ featured, secondary }: HeroSectionProps) {
  if (!featured) return null;

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main featured */}
        <div className="lg:col-span-2">
          <Link href={`/news/${featured.slug}`} className="group block article-card">
            <div className="relative h-80 lg:h-[420px] bg-[#111118] rounded-lg overflow-hidden">
              {featured.thumbnail ? (
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1E1E2E] to-[#111118] flex items-center justify-center">
                  <span className="text-6xl opacity-20">BCN</span>
                </div>
              )}
              <div className="absolute inset-0 img-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {featured.category && (
                  <span className="inline-block bg-[#E53E3E] text-white text-xs px-2 py-1 rounded mb-3 uppercase tracking-wider font-medium">
                    {featured.category.name}
                  </span>
                )}
                <h1
                  className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 group-hover:text-[#F6AD55] transition-colors"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {featured.title}
                </h1>
                {featured.excerpt && (
                  <p className="text-[#94A3B8] text-sm line-clamp-2">{featured.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-[#64748B]">
                  <span>{featured.author?.name}</span>
                  <span>•</span>
                  <span>{timeAgo(featured.publishedAt || featured.createdAt)}</span>
                  <span>•</span>
                  <span>👁 {Number(featured.viewCount).toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary articles */}
        <div className="flex flex-col gap-4">
          {secondary.map((article: any) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}