'use client';
import { create } from 'zustand';
import { apiClient } from '../lib/api/client';
export type AuthUser = { id: string; name: string; email: string; username: string; role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'JOURNALIST' | 'USER' };
type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hydrate: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<{ success: true; data: AuthUser }>('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  login: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post<{ success: true; data: AuthUser }>('/auth/login', payload);
      set({ user: response.data, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));