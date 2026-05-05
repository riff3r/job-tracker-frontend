import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { ApiResponse, AuthTokens } from '@/types';
import type { RegisterFormValues } from '@/schemas/auth';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

async function registerUser(values: RegisterFormValues): Promise<AuthTokens> {
  // Strip confirmPassword — backend doesn't need it
  const payload: RegisterPayload = {
    name: values.name,
    email: values.email,
    password: values.password,
  };
  const response = await api.post<ApiResponse<AuthTokens>>('/v1/auth/register', payload);
  return response.data.data;
}

export function useRegister() {
  return useMutation({ mutationFn: registerUser });
}
