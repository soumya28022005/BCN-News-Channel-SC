import { HomePage } from '../components/news/HomePage';
import { serverGet } from '../lib/api/server';
export const revalidate = 60;
export default async function Page() {
  const [articlesResponse, trendingResponse] = await Promise.all([
    serverGet<{ success: true; data: { items: any[] } }>('/articles?limit=10', 60),
    serverGet<{ success: true; data: any[] }>('/articles/trending', 60),
  ]);
  const latest = articlesResponse.data.items ?? [];
  const featured = latest[0] ?? null;
  return <HomePage featured={featured} latest={latest.slice(1)} trending={trendingResponse.data ?? []} />;
}