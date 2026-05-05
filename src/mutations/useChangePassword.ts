import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

async function changePassword(input: ChangePasswordInput): Promise<void> {
  await api.patch('/v1/users/me/password', input);
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}
