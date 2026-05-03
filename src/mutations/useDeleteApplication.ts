import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/v1/applications/${id}`);
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
