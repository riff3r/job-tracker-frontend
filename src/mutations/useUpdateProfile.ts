import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse, User } from '@/types';

interface UpdateProfileInput {
  name: string;
}

async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const response = await api.patch<ApiResponse<User>>('/v1/users/me', input);
  return response.data.data;
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      // Sync the updated user into the auth store so the sidebar/avatar reflect it
      const accessToken = useAuthStore.getState().accessToken ?? '';
      useAuthStore.getState().setTokens(accessToken, user);
    },
  });
}
