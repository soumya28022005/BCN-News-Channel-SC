export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'JOURNALIST' | 'READER';
  avatar?: string;
  authorProfile?: {
    title?: string;
    bio?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  publishedAt?: string;
  createdAt: string;
  viewCount: string | number;
  likeCount: number;
  commentCount: number;
  readingTime?: number;
  author?: User;
  category?: Category;
  tags?: { tag: Tag }[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}