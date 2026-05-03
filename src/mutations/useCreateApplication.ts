import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Application, ApiResponse, CreateApplicationInput } from '@/types';

async function createApplication(
  input: CreateApplicationInput
): Promise<Application> {
  const response = await api.post<ApiResponse<Application>>(
    '/v1/applications',
    input
  );
  return response.data.data;
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
