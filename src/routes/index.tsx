import { Routes, Route, Navigate } from 'react-router-dom';
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
        <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="/applications" element={<ErrorBoundary><Applications /></ErrorBoundary>} />
        <Route path="/applications/:id" element={<ErrorBoundary><ApplicationDetail /></ErrorBoundary>} />
        <Route path="/resumes" element={<ErrorBoundary><Resumes /></ErrorBoundary>} />
        <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
