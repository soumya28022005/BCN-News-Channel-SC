import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticlePage } from '../../../components/news/ArticlePage';
import { serverGet } from '../../../lib/api/server';
import { SITE_URL } from '../../../lib/config';
export const revalidate = 120;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await serverGet<{ success: true; data: any }>(`/articles/${slug}`, 120);
    const article = response.data;
    return { title: article.seoMetadata?.title ?? article.title, description: article.seoMetadata?.description ?? article.excerpt, openGraph: { title: article.seoMetadata?.title ?? article.title, description: article.seoMetadata?.description ?? article.excerpt, type: 'article', url: `${SITE_URL}/news/${slug}`, images: article.thumbnail ? [{ url: article.thumbnail }] : undefined }, twitter: { card: 'summary_large_image', title: article.seoMetadata?.title ?? article.title, description: article.seoMetadata?.description ?? article.excerpt } };
  } catch {
    return { title: 'Article not found' };
  }
}
export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const [articleResponse, relatedResponse] = await Promise.all([
      serverGet<{ success: true; data: any }>(`/articles/${slug}`, 120),
      serverGet<{ success: true; data: any[] }>(`/articles/${slug}/related`, 180),
    ]);
    return <ArticlePage article={articleResponse.data} related={relatedResponse.data ?? []} />;
  } catch {
    notFound();
  }
}