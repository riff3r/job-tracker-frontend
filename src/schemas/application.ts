import { z } from 'zod';

const statusEnum = z.enum(['WISHLIST', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN']);
const locationEnum = z.enum(['ONSITE', 'REMOTE', 'HYBRID']);
const jobUrlField = z.string().url('Must be a valid URL').optional().or(z.literal(''));

export const createApplicationSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  jobUrl: jobUrlField,
  location: locationEnum,
  salary: z.string().optional(),
  status: statusEnum,
  appliedAt: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  jobUrl: jobUrlField,
  location: locationEnum.optional(),
  salary: z.string().optional(),
  status: statusEnum,
  appliedAt: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateApplicationFormValues = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationFormValues = z.infer<typeof updateApplicationSchema>;
