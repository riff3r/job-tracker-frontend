import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn, getApiErrorMessage } from '@/lib/utils';
import { INPUT_BASE_CLASS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { useRegister } from '@/mutations/useRegister';
import { Spinner } from '@/components/ui/Spinner';
import { FormFieldError } from '@/components/ui/FormFieldError';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth';

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: '', color: '', width: '0%' };
  if (password.length < 6) return { label: 'Weak', color: 'bg-red-400', width: '25%' };
  if (password.length < 10) return { label: 'Fair', color: 'bg-yellow-400', width: '50%' };
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Good', color: 'bg-blue-400', width: '75%' };
  return { label: 'Strong', color: 'bg-green-500', width: '100%' };
}

export default function Register() {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const registerMutation = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const password = watch('password', '');
  const strength = getPasswordStrength(password);

  function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    registerMutation.mutate(values, {
      onSuccess: ({ accessToken, user }) => {
        setTokens(accessToken, user);
        navigate('/dashboard');
      },
      onError: (err) => {
        setServerError(
          getApiErrorMessage(err, 'Registration failed. This email may already be in use.'),
        );
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">JobTracker</h1>
          <p className="text-slate-500 text-sm">Create your account</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                id="register-name"
                {...register('name')}
                autoComplete="name"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'register-name-error' : undefined}
                className={cn(
                  INPUT_BASE_CLASS,
                  errors.name ? 'border-red-400' : 'border-slate-300'
                )}
                placeholder="Jane Smith"
              />
              <FormFieldError id="register-name-error">{errors.name?.message}</FormFieldError>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="register-email"
                {...register('email')}
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
                className={cn(
                  INPUT_BASE_CLASS,
                  errors.email ? 'border-red-400' : 'border-slate-300'
                )}
                placeholder="you@example.com"
              />
              <FormFieldError id="register-email-error">{errors.email?.message}</FormFieldError>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                id="register-password"
                {...register('password')}
                type="password"
                autoComplete="new-password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
                className={cn(
                  INPUT_BASE_CLASS,
                  errors.password ? 'border-red-400' : 'border-slate-300'
                )}
                placeholder="Min. 8 characters"
              />
              {password.length > 0 && (
                <div className="mt-1.5">
                  <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', strength.color)}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{strength.label}</p>
                </div>
              )}
              <FormFieldError id="register-password-error">{errors.password?.message}</FormFieldError>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input
                id="register-confirm-password"
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
                className={cn(
                  INPUT_BASE_CLASS,
                  errors.confirmPassword ? 'border-red-400' : 'border-slate-300'
                )}
                placeholder="••••••••"
              />
              <FormFieldError id="register-confirm-password-error">{errors.confirmPassword?.message}</FormFieldError>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {registerMutation.isPending && <Spinner size="sm" />}
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
