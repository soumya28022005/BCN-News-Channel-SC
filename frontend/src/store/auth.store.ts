// frontend/src/store/auth.store.ts
import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loadFromStorage: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.data?.accessToken) {
        // Token ebong user data storage-e save kora hochche
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        set({
          user: data.data.user,
          accessToken: data.data.accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Network error' };
    }
  },

  logout: () => {
    // Storage clean kora hochche
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, isAuthenticated: false });
    // Logout korar por login page-e redirect
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, accessToken: token, isAuthenticated: true });
      } catch (error) {
        // Parse error hole storage clear kore deoya hochche
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
  },
}));