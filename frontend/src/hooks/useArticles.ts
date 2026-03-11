import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Article, PaginationMeta } from '../types';

interface UseArticlesOptions {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}

export function useArticles(options: UseArticlesOptions = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 20, category, status, search } = options;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (category) params.set('category', category);
        if (status) params.set('status', status);
        if (search) params.set('search', search);

        const data = await api.get<any>(`/articles?${params.toString()}`);
        setArticles(data.data || []);
        setPagination(data.pagination || null);
      } catch {
        setError('Articles load করা যায়নি');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, limit, category, status, search]);

  const refetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (category) params.set('category', category);
      if (status) params.set('status', status);
      if (search) params.set('search', search);

      const data = await api.get<any>(`/articles?${params.toString()}`);
      setArticles(data.data || []);
      setPagination(data.pagination || null);
    } catch {
      setError('Articles load করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  return { articles, pagination, loading, error, refetch };
}