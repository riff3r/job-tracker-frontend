import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  Application,
  ApiResponse,
  CreateApplicationInput,
  PaginatedResponse,
} from '@/types';

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

    // Optimistically prepend a placeholder row so the UI updates immediately.
    // The server response replaces it on settle (via invalidation).
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      const previousData = queryClient.getQueriesData<PaginatedResponse<Application>>({
        queryKey: ['applications'],
      });

      const now = new Date().toISOString();
      const optimistic: Application = {
        id: `optimistic-${Date.now()}`,
        userId: '',
        company: input.company,
        role: input.role,
        jobUrl: input.jobUrl ?? null,
        location: input.location ?? null,
        salary: input.salary ?? null,
        notes: input.notes ?? null,
        status: input.status,
        appliedAt: input.appliedAt ?? null,
        followUpDate: input.followUpDate ?? null,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueriesData<PaginatedResponse<Application>>(
        { queryKey: ['applications'] },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: [optimistic, ...old.items],
            total: old.total + 1,
          };
        },
      );

      return { previousData };
    },

    onError: (_err, _input, context) => {
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
