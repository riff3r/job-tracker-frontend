import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';
// AppInit reads store state via getState() inside useEffect to keep deps array stable
import { AppRoutes } from '@/routes';
import type { ApiResponse, AuthTokens } from '@/types';

function AppInit() {
  // useRef persists across React StrictMode's double-invoke, so this guard
  // ensures only one refresh request fires even in development.
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    // Clean up the stale `refreshToken` from the pre-cookie auth migration.
    // Safe to remove this line after a deploy or two, once all users have visited.
    localStorage.removeItem('refreshToken');

    const { setTokens, clearAuth } = useAuthStore.getState();

    // Use raw axios (not the api instance) to avoid the response interceptor
    // trying to re-refresh a failing refresh call, which would cause a loop.
    // The httpOnly cookie is sent automatically by the browser (same-origin via Vite proxy).
    axios
      .post<ApiResponse<AuthTokens>>(`${import.meta.env.VITE_API_URL}/v1/auth/refresh`, {})
      .then((res) => {
        const { accessToken, user } = res.data.data;
        setTokens(accessToken, user);
      })
      .catch(() => {
        clearAuth();
      });
  }, []);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInit />
        <Toaster position="bottom-right" richColors />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
