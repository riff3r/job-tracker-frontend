import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Resume } from '@/types';

async function deleteResume(id: string): Promise<void> {
  await api.delete(`/v1/resumes/${id}`);
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,

    // Optimistically remove the resume from the cached list, rollback on error.
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['resumes'] });

      const previousData = queryClient.getQueryData<Resume[]>(['resumes']);

      queryClient.setQueryData<Resume[]>(['resumes'], (old) =>
        old ? old.filter((r) => r.id !== id) : old,
      );

      return { previousData };
    },

    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['resumes'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
