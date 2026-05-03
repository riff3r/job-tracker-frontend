import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { User, ApiResponse } from '@/types';

async function fetchMe(): Promise<User> {
  const response = await api.get<ApiResponse<User>>('/v1/users/me');
  return response.data.data;
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });
}
