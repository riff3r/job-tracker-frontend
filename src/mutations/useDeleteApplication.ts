import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Application, PaginatedResponse } from '@/types';

async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/v1/applications/${id}`);
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,

    // Optimistically remove the row from any cached list. The single-app cache
    // entry (queryKey: ['applications', id]) shape is `Application` (not paginated),
    // so the `items` check below skips it safely.
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      const previousData = queryClient.getQueriesData<PaginatedResponse<Application>>({
        queryKey: ['applications'],
      });

      queryClient.setQueriesData<PaginatedResponse<Application>>(
        { queryKey: ['applications'] },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.filter((app) => app.id !== id),
            total: Math.max(0, old.total - 1),
          };
        },
      );

      return { previousData };
    },

    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
