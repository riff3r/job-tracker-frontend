import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { ApiResponse, ApplicationStats } from '@/types';

export function useApplicationStats() {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ApplicationStats>>('/v1/applications/stats');
      return response.data.data;
    },
    staleTime: 60_000,
  });
}
