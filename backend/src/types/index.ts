import { Role } from '@prisma/client';

// ─── Express Request Extension ────────────────────────────────────
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        name: string;
      };
    }
  }
}

// ─── Pagination ───────────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationResult;
}

// ─── API Response ─────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

// ─── Auth ─────────────────────────────────────────────────────────
export interface JwtPayload {
  id: string;
  role: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  avatar?: string;
}

// ─── Article ──────────────────────────────────────────────────────
export interface ArticleFilters {
  page: number;
  limit: number;
  category?: string;
  tag?: string;
  author?: string;
  status?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  featured?: boolean;
  breaking?: boolean;
  trending?: boolean;
}

export interface ViewTrackData {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

// ─── SEO ──────────────────────────────────────────────────────────
export interface SeoMetaInput {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAt?: Date;
  slug?: string;
  thumbnailUrl?: string;
}

export interface SeoAnalysis {
  seoScore: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  wordCount: number;
  sentenceCount: number;
  suggestions: string[];
  keywords: string[];
  titleLength: number;
  descriptionLength: number;
}

// ─── Search ───────────────────────────────────────────────────────
export interface SearchParams {
  query: string;
  category?: string;
  tag?: string;
  page: number;
  limit: number;
  sort?: string;
}

// ─── Media ────────────────────────────────────────────────────────
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
}