import { SITE_URL } from '../../lib/config';
export function ArticleJsonLd({ title, description, slug, publishedAt, image, author }: { title: string; description: string; slug: string; publishedAt?: string | null; image?: string | null; author?: string | null; }) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title, description, image: image ? [image] : undefined, datePublished: publishedAt, author: author ? [{ '@type': 'Person', name: author }] : undefined, mainEntityOfPage: `${SITE_URL}/news/${slug}`, publisher: { '@type': 'Organization', name: 'BCN Network' } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}