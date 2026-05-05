import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn, getApiErrorMessage } from '@/lib/utils';
import { INPUT_BASE_CLASS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { useLogin } from '@/mutations/useLogin';
import { Spinner } from '@/components/ui/Spinner';
import { FormFieldError } from '@/components/ui/FormFieldError';
import { loginSchema, type LoginFormValues } from '@/schemas/auth';

export default function Login() {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginFormValues) {
    setServerError(null);
    login.mutate(values, {
      onSuccess: ({ accessToken, user }) => {
        setTokens(accessToken, user);
        navigate('/dashboard');
      },
      onError: (err) => {
        setServerError(getApiErrorMessage(err, 'Invalid email or password'));
      },
    });
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/v1/auth/google`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">JobTracker</h1>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="login-email"
                {...register('email')}
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                className={cn(
                  INPUT_BASE_CLASS,
                  errors.email ? 'border-red-400' : 'border-slate-300'
                )}
                placeholder="you@example.com"
              />
              <FormFieldError id="login-email-error">{errors.email?.message}</FormFieldError>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                id="login-password"
                {...register('password')}
                type="password"
                autoComplete="current-password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                className={cn(
                  INPUT_BASE_CLASS,
                  errors.password ? 'border-red-400' : 'border-slate-300'
                )}
                placeholder="••••••••"
              />
              <FormFieldError id="login-password-error">{errors.password?.message}</FormFieldError>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {login.isPending && <Spinner size="sm" />}
              Sign in
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white px-2">
              or
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

