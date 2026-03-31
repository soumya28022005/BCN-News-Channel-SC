import { ArticleCard, type ArticleCardProps } from './ArticleCard';
export function RelatedArticles({ items }: { items: ArticleCardProps['article'][] }) {
  if (!items.length) return null;
  return <section className="mt-16 space-y-6"><div><p className="text-sm uppercase tracking-[0.2em] text-amber-300">Continue reading</p><h2 className="mt-2 text-3xl font-semibold text-white">Related stories</h2></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((article) => <ArticleCard key={article.id} article={article} />)}</div></section>;
}