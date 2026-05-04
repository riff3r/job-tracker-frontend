import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: (accessToken, user) => {
    set({ accessToken, user, isAuthenticated: true, isLoading: false });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
