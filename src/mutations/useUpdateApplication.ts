import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  Application,
  ApiResponse,
  UpdateApplicationInput,
  PaginatedResponse,
} from '@/types';

interface UpdateApplicationParams {
  id: string;
  input: UpdateApplicationInput;
}

async function updateApplication({
  id,
  input,
}: UpdateApplicationParams): Promise<Application> {
  const response = await api.patch<ApiResponse<Application>>(
    `/v1/applications/${id}`,
    input
  );
  return response.data.data;
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplication,

    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      const previousData = queryClient.getQueriesData<
        PaginatedResponse<Application>
      >({ queryKey: ['applications'] });

      if (input.status) {
        queryClient.setQueriesData<PaginatedResponse<Application>>(
          { queryKey: ['applications'] },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              items: old.items.map((app) =>
                app.id === id ? { ...app, status: input.status! } : app
              ),
            };
          }
        );
      }

      return { previousData };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', id] });
    },
  });
}
