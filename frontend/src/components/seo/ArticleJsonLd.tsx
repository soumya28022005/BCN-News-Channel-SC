interface ArticleJsonLdProps {
  title: string;
  description?: string;
  image?: string;
  publishedAt?: string;
  author?: string;
  url?: string;
}

export default function ArticleJsonLd({
  title, description, image, publishedAt, author, url
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description || '',
    image: image ? [image] : [],
    datePublished: publishedAt || new Date().toISOString(),
    author: { '@type': 'Person', name: author || 'BCN' },
    publisher: {
      '@type': 'Organization',
      name: 'The Bengal Chronicle Network',
      logo: { '@type': 'ImageObject', url: 'https://bengalchronicle.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url || '' },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}