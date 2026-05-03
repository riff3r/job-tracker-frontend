import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useApplication } from '@/hooks/useApplication';
import { useUpdateApplication } from '@/mutations/useUpdateApplication';
import { useDeleteApplication } from '@/mutations/useDeleteApplication';
import { ActivityTimeline } from '@/components/applications/ActivityTimeline';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner';
import { cn, getApiErrorMessage } from '@/lib/utils';
import { APPLICATION_STATUSES, STATUS_LABELS } from '@/types';

const LOCATION_OPTIONS = [
  { value: 'ONSITE', label: 'On Site' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
] as const;

const schema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.enum(['ONSITE', 'REMOTE', 'HYBRID']).optional(),
  salary: z.string().optional(),
  status: z.enum(['WISHLIST', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN']),
  appliedAt: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: application, isLoading, isError } = useApplication(id ?? '');
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (application) {
      reset({
        company: application.company,
        role: application.role,
        jobUrl: application.jobUrl ?? '',
        location: application.location ?? undefined,
        salary: application.salary ?? '',
        status: application.status,
        appliedAt: application.appliedAt
          ? new Date(application.appliedAt).toISOString().split('T')[0]
          : '',
        followUpDate: application.followUpDate
          ? new Date(application.followUpDate).toISOString().split('T')[0]
          : '',
        notes: application.notes ?? '',
      });
    }
  }, [application, reset]);

  function onSubmit(values: FormValues) {
    if (!id) return;
    updateApplication.mutate(
      {
        id,
        input: {
          ...values,
          jobUrl: values.jobUrl || undefined,
          location: values.location || undefined,
          salary: values.salary || undefined,
          notes: values.notes || undefined,
          appliedAt: values.appliedAt || undefined,
          followUpDate: values.followUpDate || undefined,
        },
      },
      {
        onSuccess: () => toast.success('Application updated'),
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update application')),
      }
    );
  }

  function handleDelete() {
    if (!id) return;
    deleteApplication.mutate(id, {
      onSuccess: () => {
        toast.success('Application deleted');
        navigate('/applications');
      },
      onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to delete application')),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-slate-500 text-sm">Application not found.</p>
        <button
          onClick={() => navigate('/applications')}
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:underline"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/applications')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-slate-900">{application.company}</h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-slate-500 text-sm mt-1 ml-8">{application.role}</p>
        </div>
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input
                    {...register('company')}
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      errors.company ? 'border-red-400' : 'border-slate-300'
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <input
                    {...register('role')}
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      errors.role ? 'border-red-400' : 'border-slate-300'
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job URL</label>
                <input
                  {...register('jobUrl')}
                  type="url"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <select
                    {...register('location')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">— select —</option>
                    {LOCATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input
                    {...register('salary')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  {...register('status')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Applied Date</label>
                  <input
                    {...register('appliedAt')}
                    type="date"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    {...register('followUpDate')}
                    type="date"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isDirty || updateApplication.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updateApplication.isPending && <Spinner size="sm" />}
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Activity timeline */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Activity</h2>
            <ActivityTimeline logs={application.activityLogs ?? []} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete application"
        description={`Are you sure you want to delete the application for ${application.company}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteApplication.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
