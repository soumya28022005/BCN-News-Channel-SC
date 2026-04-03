import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // 🔥 LOGIN (COOKIE BASED)
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ VERY IMPORTANT
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok || !data.success) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        return {
          success: false,
          error: data.message || 'Login failed',
        };
      }

      set({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };

    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return { success: false, error: 'Network error' };
    }
  },

  // 🔥 LOGOUT
  logout: async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // ✅ cookie clear
      });
    } catch {
      // ignore
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    window.location.href = '/auth/login';
  },

  // 🔥 AUTO LOGIN (COOKIE CHECK)
  loadFromStorage: async () => {
    set({ isLoading: true });

    try {
      const res = await fetch(`${API}/auth/me`, {
        method: 'GET',
        credentials: 'include', // ✅ VERY IMPORTANT
      });

      const data = await res.json();

      console.log("ME RESPONSE:", data);

      if (res.ok && data.success && data.data) {
        set({
          user: data.data,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch {
      // ignore
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));