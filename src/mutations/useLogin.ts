import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { ApiResponse, AuthTokens } from '@/types';
import type { LoginFormValues } from '@/schemas/auth';

async function login(values: LoginFormValues): Promise<AuthTokens> {
  const response = await api.post<ApiResponse<AuthTokens>>('/v1/auth/login', values);
  return response.data.data;
}

export function useLogin() {
  return useMutation({ mutationFn: login });
}
