import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-sm font-medium text-primary tracking-wide uppercase">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-outline">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to dashboard
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-ink bg-white border border-surface-high rounded-lg hover:bg-surface-low transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
