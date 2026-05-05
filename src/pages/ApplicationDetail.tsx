import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { FormFieldError } from '@/components/ui/FormFieldError';
import { cn, getApiErrorMessage } from '@/lib/utils';
import { LOCATION_OPTIONS, INPUT_BASE_CLASS } from '@/lib/constants';
import { APPLICATION_STATUSES, STATUS_LABELS } from '@/lib/statusTokens';
import { updateApplicationSchema, type UpdateApplicationFormValues } from '@/schemas/application';

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
  } = useForm<UpdateApplicationFormValues>({ resolver: zodResolver(updateApplicationSchema) });

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

  function onSubmit(values: UpdateApplicationFormValues) {
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
                  <label htmlFor="detail-company" className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input
                    id="detail-company"
                    {...register('company')}
                    aria-invalid={errors.company ? 'true' : 'false'}
                    aria-describedby={errors.company ? 'detail-company-error' : undefined}
                    className={cn(INPUT_BASE_CLASS, errors.company ? 'border-red-400' : 'border-slate-300')}
                  />
                  <FormFieldError id="detail-company-error">{errors.company?.message}</FormFieldError>
                </div>
                <div>
                  <label htmlFor="detail-role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <input
                    id="detail-role"
                    {...register('role')}
                    aria-invalid={errors.role ? 'true' : 'false'}
                    aria-describedby={errors.role ? 'detail-role-error' : undefined}
                    className={cn(INPUT_BASE_CLASS, errors.role ? 'border-red-400' : 'border-slate-300')}
                  />
                  <FormFieldError id="detail-role-error">{errors.role?.message}</FormFieldError>
                </div>
              </div>

              <div>
                <label htmlFor="detail-job-url" className="block text-sm font-medium text-slate-700 mb-1">Job URL</label>
                <input
                  id="detail-job-url"
                  {...register('jobUrl')}
                  type="url"
                  aria-invalid={errors.jobUrl ? 'true' : 'false'}
                  aria-describedby={errors.jobUrl ? 'detail-job-url-error' : undefined}
                  className={cn(INPUT_BASE_CLASS, errors.jobUrl ? 'border-red-400' : 'border-slate-300')}
                />
                <FormFieldError id="detail-job-url-error">{errors.jobUrl?.message}</FormFieldError>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="detail-location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <select
                    id="detail-location"
                    {...register('location')}
                    className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
                  >
                    <option value="">— select —</option>
                    {LOCATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="detail-salary" className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input
                    id="detail-salary"
                    {...register('salary')}
                    className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="detail-status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  id="detail-status"
                  {...register('status')}
                  className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="detail-applied-at" className="block text-sm font-medium text-slate-700 mb-1">Applied Date</label>
                  <input
                    id="detail-applied-at"
                    {...register('appliedAt')}
                    type="date"
                    className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
                  />
                </div>
                <div>
                  <label htmlFor="detail-follow-up-date" className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    id="detail-follow-up-date"
                    {...register('followUpDate')}
                    type="date"
                    className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="detail-notes" className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  id="detail-notes"
                  {...register('notes')}
                  rows={4}
                  className={cn(INPUT_BASE_CLASS, 'border-slate-300 resize-none')}
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
