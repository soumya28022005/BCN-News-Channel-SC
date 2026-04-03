import sanitizeHtml from 'sanitize-html';

function cleanPlainText(value?: string | null) {
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanUrl(value?: string | null) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export function sanitizeArticleInput(input: any) {
  return {
    ...input,
    title: cleanPlainText(input.title),
    excerpt: cleanPlainText(input.excerpt),
    thumbnailAlt: cleanPlainText(input.thumbnailAlt),
    seoTitle: cleanPlainText(input.seoTitle),
    seoDescription: cleanPlainText(input.seoDescription),
    source: cleanPlainText(input.source),
    thumbnail: cleanUrl(input.thumbnail),
    youtubeUrl: cleanUrl(input.youtubeUrl),
    seoKeywords: Array.isArray(input.seoKeywords)
      ? input.seoKeywords.map((item: string) => cleanPlainText(item)).filter(Boolean)
      : [],
    content: sanitizeHtml(input.content || '', {
      allowedTags: [
        'p',
        'br',
        'strong',
        'b',
        'em',
        'i',
        'u',
        'h2',
        'h3',
        'h4',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
        'figure',
        'figcaption',
        'iframe'
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel', 'title'],
        img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
        iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
        '*': ['class']
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesByTag: {
        img: ['http', 'https', 'data']
      },
      transformTags: {
        a: sanitizeHtml.simpleTransform('a', {
          target: '_blank',
          rel: 'noopener noreferrer nofollow'
        })
      }
    }),
  };
}
