import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setTokens: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  setTokens: (accessToken, user) => {
    set({ accessToken, user, isLoading: false });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

// Selector — derived from accessToken so the two can never disagree.
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.accessToken !== null);
