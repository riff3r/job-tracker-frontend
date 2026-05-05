import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { ApiResponse, ActivityLogWithApplication } from '@/types';

export function useRecentActivity(limit = 6) {
  return useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ActivityLogWithApplication[]>>(
        '/v1/applications/recent-activity',
        { params: { limit } },
      );
      return response.data.data;
    },
    staleTime: 30_000,
  });
}
