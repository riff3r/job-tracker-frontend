import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

async function deleteResume(id: string): Promise<void> {
  await api.delete(`/v1/resumes/${id}`);
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
