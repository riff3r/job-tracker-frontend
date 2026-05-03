import { z } from 'zod';

export const resumeUploadSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

export type ResumeUploadFormValues = z.infer<typeof resumeUploadSchema>;
