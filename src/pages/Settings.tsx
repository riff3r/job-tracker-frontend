import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile } from '@/mutations/useUpdateProfile';
import { useUpdateAvatar } from '@/mutations/useUpdateAvatar';
import { useChangePassword } from '@/mutations/useChangePassword';
import { Spinner } from '@/components/ui/Spinner';
import { FormFieldError } from '@/components/ui/FormFieldError';
import { cn, getApiErrorMessage } from '@/lib/utils';
import { AVATAR_MAX_BYTES, INPUT_BASE_CLASS } from '@/lib/constants';
import { profileSchema, passwordSchema, type ProfileFormValues, type PasswordFormValues } from '@/schemas/user';

export default function Settings() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  const changePassword = useChangePassword();

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
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (user) resetProfile({ name: user.name });
  }, [user, resetProfile]);

  function onProfileSubmit(values: ProfileFormValues) {
    updateProfile.mutate(
      { name: values.name },
      {
        onSuccess: () => {
          toast.success('Profile updated');
          resetProfile({ name: values.name });
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update profile')),
      },
    );
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    updateAvatar.mutate(file, {
      onSuccess: () => toast.success('Avatar updated'),
      onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update avatar')),
    });
  }

  function onPasswordSubmit(values: PasswordFormValues) {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success('Password changed');
          resetPassword();
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to change password')),
      },
    );
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
            <label htmlFor="settings-name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              id="settings-name"
              {...registerProfile('name')}
              aria-invalid={profileErrors.name ? 'true' : 'false'}
              aria-describedby={profileErrors.name ? 'settings-name-error' : undefined}
              className={cn(
                INPUT_BASE_CLASS,
                profileErrors.name ? 'border-red-400' : 'border-slate-300'
              )}
            />
            <FormFieldError id="settings-name-error">{profileErrors.name?.message}</FormFieldError>
          </div>
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              id="settings-email"
              value={user?.email ?? ''}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isProfileDirty || updateProfile.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {updateProfile.isPending && <Spinner size="sm" />}
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
                updateAvatar.isPending
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              )}
            >
              {updateAvatar.isPending ? <Spinner size="sm" /> : null}
              {updateAvatar.isPending ? 'Uploading...' : 'Change avatar'}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={updateAvatar.isPending}
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
            <label htmlFor="settings-current-password" className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input
              id="settings-current-password"
              {...registerPassword('currentPassword')}
              type="password"
              autoComplete="current-password"
              aria-invalid={passwordErrors.currentPassword ? 'true' : 'false'}
              aria-describedby={passwordErrors.currentPassword ? 'settings-current-password-error' : undefined}
              className={cn(
                INPUT_BASE_CLASS,
                passwordErrors.currentPassword ? 'border-red-400' : 'border-slate-300'
              )}
            />
            <FormFieldError id="settings-current-password-error">{passwordErrors.currentPassword?.message}</FormFieldError>
          </div>
          <div>
            <label htmlFor="settings-new-password" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              id="settings-new-password"
              {...registerPassword('newPassword')}
              type="password"
              autoComplete="new-password"
              aria-invalid={passwordErrors.newPassword ? 'true' : 'false'}
              aria-describedby={passwordErrors.newPassword ? 'settings-new-password-error' : undefined}
              className={cn(
                INPUT_BASE_CLASS,
                passwordErrors.newPassword ? 'border-red-400' : 'border-slate-300'
              )}
            />
            <FormFieldError id="settings-new-password-error">{passwordErrors.newPassword?.message}</FormFieldError>
          </div>
          <div>
            <label htmlFor="settings-confirm-new-password" className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input
              id="settings-confirm-new-password"
              {...registerPassword('confirmNewPassword')}
              type="password"
              autoComplete="new-password"
              aria-invalid={passwordErrors.confirmNewPassword ? 'true' : 'false'}
              aria-describedby={passwordErrors.confirmNewPassword ? 'settings-confirm-new-password-error' : undefined}
              className={cn(
                INPUT_BASE_CLASS,
                passwordErrors.confirmNewPassword ? 'border-red-400' : 'border-slate-300'
              )}
            />
            <FormFieldError id="settings-confirm-new-password-error">{passwordErrors.confirmNewPassword?.message}</FormFieldError>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {changePassword.isPending && <Spinner size="sm" />}
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
