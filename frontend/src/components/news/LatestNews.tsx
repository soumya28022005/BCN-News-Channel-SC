import ArticleCard from './ArticleCard';
import FixedAd from '../news/FixedAd';

export default function LatestSection({ articles }: any) {
  if (!articles || articles.length === 0) return null;

  const top = articles.slice(0, 3);
  const rest = articles.slice(3);

  return (
    <section className="mt-10">

      {/* SECTION TITLE */}
      <h2 className="section-title">সর্বশেষ সংবাদ</h2>

      {/* 🔴 TOP GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">

        {/* BIG CARD */}
        <div className="md:col-span-2">
          <ArticleCard article={top[0]} />
        </div>

        {/* SIDE CARDS */}
        <div className="flex flex-col gap-4">
          {top.slice(1).map((item: any) => (
            <ArticleCard key={item.id} article={item} variant="horizontal" />
          ))}
        </div>

      </div>

      {/* 📰 MAIN GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {rest.map((article: any, i: number) => (
          <div key={article.id}>

            <ArticleCard article={article} />

            {/* 🔥 AD EVERY 6 */}
            {(i + 1) % 6 === 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <FixedAd />
              </div>
            )}

          </div>
        ))}

      </div>

    </section>
  );
}

//this is src->components->news->LatestNews.tsx