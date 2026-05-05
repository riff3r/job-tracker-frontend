import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';

// Eager — public pages are needed immediately (login redirects, OAuth callback, 404).
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import GoogleCallback from '@/pages/GoogleCallback';
import NotFound from '@/pages/NotFound';

// Lazy — protected pages are only needed once authenticated, so we keep them
// out of the initial bundle (Dashboard alone pulls in chart code).
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Applications = lazy(() => import('@/pages/Applications'));
const ApplicationDetail = lazy(() => import('@/pages/ApplicationDetail'));
const Resumes = lazy(() => import('@/pages/Resumes'));
const Settings = lazy(() => import('@/pages/Settings'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner size="lg" />
    </div>
  );
}

export function AppRoutes() {
  return (
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
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/applications"
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageFallback />}>
                <Applications />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageFallback />}>
                <ApplicationDetail />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/resumes"
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageFallback />}>
                <Resumes />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/settings"
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageFallback />}>
                <Settings />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
