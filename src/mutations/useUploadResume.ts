import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Resume, ApiResponse } from '@/types';

interface UploadResumeInput {
  file: File;
  label: string;
  onUploadProgress?: (percent: number) => void;
}

async function uploadResume({
  file,
  label,
  onUploadProgress,
}: UploadResumeInput): Promise<Resume> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('label', label);

  const response = await api.post<ApiResponse<Resume>>('/v1/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percent);
      }
    },
  });
  return response.data.data;
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
