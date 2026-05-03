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
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.followUpDateAfter) params.set('followUpDateAfter', filters.followUpDateAfter);
  if (filters.followUpDateBefore) params.set('followUpDateBefore', filters.followUpDateBefore);

  const response = await api.get<ApiResponse<PaginatedResponse<Application>>>(
    `/v1/applications?${params.toString()}`
  );
  return response.data.data;
}

export function useApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => fetchApplications(filters),
  });
}
