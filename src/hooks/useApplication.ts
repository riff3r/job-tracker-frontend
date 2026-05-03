import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Application, ApiResponse } from '@/types';

async function fetchApplication(id: string): Promise<Application> {
  const response = await api.get<ApiResponse<Application>>(
    `/v1/applications/${id}`
  );
  return response.data.data;
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  });
}
