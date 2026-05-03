import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore, getRefreshToken } from '@/store/authStore';
import { api } from '@/lib/axios';
import { Spinner } from '@/components/ui/Spinner';
import { cn, getApiErrorMessage } from '@/lib/utils';
import type { ApiResponse, User } from '@/types';

const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user, setTokens } = useAuthStore();
  const [avatarLoading, setAvatarLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (user) resetProfile({ name: user.name });
  }, [user, resetProfile]);

  async function onProfileSubmit(values: ProfileFormValues) {
    try {
      const res = await api.patch<ApiResponse<User>>('/v1/users/me', { name: values.name });
      const refreshToken = getRefreshToken() ?? '';
      setTokens(useAuthStore.getState().accessToken ?? '', refreshToken, res.data.data);
      toast.success('Profile updated');
      resetProfile({ name: values.name });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update profile'));
    }
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are accepted');
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error('Image must be smaller than 2MB');
      return;
    }
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post<ApiResponse<User>>('/v1/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const refreshToken = getRefreshToken() ?? '';
      setTokens(useAuthStore.getState().accessToken ?? '', refreshToken, res.data.data);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update avatar'));
    } finally {
      setAvatarLoading(false);
    }
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    try {
      await api.patch('/v1/users/me/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed');
      resetPassword();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to change password'));
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Profile</h2>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              {...registerProfile('name')}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                profileErrors.name ? 'border-red-400' : 'border-slate-300'
              )}
            />
            {profileErrors.name && (
              <p className="text-xs text-red-500 mt-1">{profileErrors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              value={user?.email ?? ''}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isProfileDirty}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Save profile
            </button>
          </div>
        </form>
      </div>

      {/* Avatar section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Avatar</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xl flex-shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <label
              htmlFor="avatar-upload"
              className={cn(
                'px-4 py-2 text-sm font-medium border rounded-lg cursor-pointer flex items-center gap-2',
                avatarLoading
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              )}
            >
              {avatarLoading ? <Spinner size="sm" /> : null}
              {avatarLoading ? 'Uploading...' : 'Change avatar'}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={avatarLoading}
              onChange={onAvatarChange}
            />
            <p className="text-xs text-slate-400 mt-1">Images only, max 2MB</p>
          </div>
        </div>
      </div>

      {/* Password section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input
              {...registerPassword('currentPassword')}
              type="password"
              autoComplete="current-password"
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                passwordErrors.currentPassword ? 'border-red-400' : 'border-slate-300'
              )}
            />
            {passwordErrors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              {...registerPassword('newPassword')}
              type="password"
              autoComplete="new-password"
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                passwordErrors.newPassword ? 'border-red-400' : 'border-slate-300'
              )}
            />
            {passwordErrors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input
              {...registerPassword('confirmNewPassword')}
              type="password"
              autoComplete="new-password"
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                passwordErrors.confirmNewPassword ? 'border-red-400' : 'border-slate-300'
              )}
            />
            {passwordErrors.confirmNewPassword && (
              <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmNewPassword.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isPasswordSubmitting && <Spinner size="sm" />}
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
