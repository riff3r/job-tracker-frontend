import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import axios from 'axios';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore, getRefreshToken } from '@/store/authStore';
// AppInit reads store state via getState() inside useEffect to keep deps array stable
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import GoogleCallback from '@/pages/GoogleCallback';
import Dashboard from '@/pages/Dashboard';
import Applications from '@/pages/Applications';
import ApplicationDetail from '@/pages/ApplicationDetail';
import Resumes from '@/pages/Resumes';
import Settings from '@/pages/Settings';
import type { ApiResponse, AuthTokens } from '@/types';

function AppInit() {
  useEffect(() => {
    const { setTokens, clearAuth, setLoading } = useAuthStore.getState();
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setLoading(false);
      return;
    }

    // Use raw axios (not the api instance) to avoid the response interceptor
    // trying to re-refresh a failing refresh call, which would cause a loop.
    axios
      .post<ApiResponse<AuthTokens>>(
        `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
        { refreshToken }
      )
      .then((res) => {
        const { accessToken, refreshToken: newRefreshToken, user } = res.data.data;
        setTokens(accessToken, newRefreshToken, user);
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
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          {/* Protected */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path="/applications"
              element={
                <ErrorBoundary>
                  <Applications />
                </ErrorBoundary>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ErrorBoundary>
                  <ApplicationDetail />
                </ErrorBoundary>
              }
            />
            <Route
              path="/resumes"
              element={
                <ErrorBoundary>
                  <Resumes />
                </ErrorBoundary>
              }
            />
            <Route
              path="/settings"
              element={
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
