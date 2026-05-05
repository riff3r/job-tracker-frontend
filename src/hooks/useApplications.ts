import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { ApplicationStatus, PaginatedResponse, Application, ApiResponse } from '@/types';

interface ApplicationFilters {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
  followUpDateAfter?: string;
  followUpDateBefore?: string;
}

async function fetchApplications(
  filters: ApplicationFilters
): Promise<PaginatedResponse<Application>> {
  // Axios drops undefined params automatically and handles encoding.
  const response = await api.get<ApiResponse<PaginatedResponse<Application>>>(
    '/v1/applications',
    { params: filters },
  );
  return response.data.data;
}

export function useApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => fetchApplications(filters),
  });
}
