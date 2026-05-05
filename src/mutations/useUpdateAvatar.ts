import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse, User } from '@/types';

async function updateAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post<ApiResponse<User>>('/v1/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export function useUpdateAvatar() {
  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: (user) => {
      const accessToken = useAuthStore.getState().accessToken ?? '';
      useAuthStore.getState().setTokens(accessToken, user);
    },
  });
}
