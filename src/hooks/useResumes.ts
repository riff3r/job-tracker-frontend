import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Resume, ApiResponse } from '@/types';

async function fetchResumes(): Promise<Resume[]> {
  const response = await api.get<ApiResponse<Resume[]>>('/v1/resumes');
  return response.data.data;
}

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: fetchResumes,
  });
}
