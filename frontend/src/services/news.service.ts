import type { News, NewsListResponse, SingleNewsResponse } from '../models/News.ts';

type QueryValue = string | number | boolean | undefined | null;

function buildQuery(params: Record<string, QueryValue>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json();
}

export const newsService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: string;
    featured?: boolean;
    breaking?: boolean;
    trending?: boolean;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<NewsListResponse> {
    const query = buildQuery({
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      category: params?.category,
      search: params?.search,
      status: params?.status ?? 'PUBLISHED',
      featured: params?.featured,
      breaking: params?.breaking,
      trending: params?.trending,
      sort: params?.sort,
      order: params?.order,
    });

    const res = await fetch(`/api/news${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    return parseJson<NewsListResponse>(res);
  },

  async getBySlug(slug: string): Promise<SingleNewsResponse> {
    const res = await fetch(`/api/news/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    return parseJson<SingleNewsResponse>(res);
  },

  async getTrending(limit = 10) {
    const res = await fetch(`/api/news/trending?limit=${limit}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    return parseJson<NewsListResponse>(res);
  },

  async getBreaking() {
    const res = await fetch('/api/news/breaking', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    return parseJson<NewsListResponse>(res);
  },

  async getRelated(slug: string, limit = 6) {
    const res = await fetch(
      `/api/news/${encodeURIComponent(slug)}/related?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return parseJson<NewsListResponse>(res);
  },
};

export type { News };
