export type NewsAuthor = {
  id?: string;
  name?: string;
  username?: string;
};

export type NewsCategory = {
  id?: string;
  name?: string;
  slug?: string;
  color?: string;
};

export type NewsTag = {
  id?: string;
  name?: string;
  slug?: string;
};

export type NewsSeoMeta = {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
};

export type News = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  source?: string;
  status?: string;
  language?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  readingTime?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: NewsAuthor | null;
  category?: NewsCategory | null;
  tags?: NewsTag[];
  seo?: NewsSeoMeta | null;
};

export type Pagination = {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type NewsListResponse = {
  success?: boolean;
  data: News[];
  pagination?: Pagination;
};

export type SingleNewsResponse = {
  success?: boolean;
  data: News;
};
