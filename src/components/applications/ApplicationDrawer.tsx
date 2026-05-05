import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn, getApiErrorMessage, todayISO } from '@/lib/utils';
import { LOCATION_OPTIONS, INPUT_BASE_CLASS } from '@/lib/constants';
import { APPLICATION_STATUSES, STATUS_LABELS } from '@/lib/statusTokens';
import { useCreateApplication } from '@/mutations/useCreateApplication';
import { Spinner } from '@/components/ui/Spinner';
import { FormFieldError } from '@/components/ui/FormFieldError';
import { createApplicationSchema, type CreateApplicationFormValues } from '@/schemas/application';

interface ApplicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationDrawer({ isOpen, onClose }: ApplicationDrawerProps) {
  const createApplication = useCreateApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      status: 'APPLIED',
      location: 'ONSITE',
      appliedAt: todayISO(),
    },
  });

  function onSubmit(values: CreateApplicationFormValues) {
    createApplication.mutate(
      {
        ...values,
        jobUrl: values.jobUrl || undefined,
        salary: values.salary || undefined,
        notes: values.notes || undefined,
        appliedAt: values.appliedAt || undefined,
        followUpDate: values.followUpDate || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Application created');
          reset({
            status: 'APPLIED',
            location: 'ONSITE',
            appliedAt: todayISO(),
          });
          onClose();
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to create application'));
        },
      }
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            New Application
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          <div>
            <label htmlFor="drawer-company" className="block text-sm font-medium text-slate-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              id="drawer-company"
              {...register('company')}
              aria-invalid={errors.company ? 'true' : 'false'}
              aria-describedby={errors.company ? 'drawer-company-error' : undefined}
              className={cn(
                INPUT_BASE_CLASS,
                errors.company ? 'border-red-400' : 'border-slate-300'
              )}
              placeholder="e.g. Google"
            />
            <FormFieldError id="drawer-company-error">{errors.company?.message}</FormFieldError>
          </div>

          <div>
            <label htmlFor="drawer-role" className="block text-sm font-medium text-slate-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              id="drawer-role"
              {...register('role')}
              aria-invalid={errors.role ? 'true' : 'false'}
              aria-describedby={errors.role ? 'drawer-role-error' : undefined}
              className={cn(
                INPUT_BASE_CLASS,
                errors.role ? 'border-red-400' : 'border-slate-300'
              )}
              placeholder="e.g. Frontend Engineer"
            />
            <FormFieldError id="drawer-role-error">{errors.role?.message}</FormFieldError>
          </div>

          <div>
            <label htmlFor="drawer-job-url" className="block text-sm font-medium text-slate-700 mb-1">
              Job URL
            </label>
            <input
              id="drawer-job-url"
              {...register('jobUrl')}
              type="url"
              aria-invalid={errors.jobUrl ? 'true' : 'false'}
              aria-describedby={errors.jobUrl ? 'drawer-job-url-error' : undefined}
              className={cn(INPUT_BASE_CLASS, errors.jobUrl ? 'border-red-400' : 'border-slate-300')}
              placeholder="https://..."
            />
            <FormFieldError id="drawer-job-url-error">{errors.jobUrl?.message}</FormFieldError>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="drawer-location" className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <select
                id="drawer-location"
                {...register('location')}
                className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="drawer-salary" className="block text-sm font-medium text-slate-700 mb-1">
                Salary
              </label>
              <input
                id="drawer-salary"
                {...register('salary')}
                className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
                placeholder="$80k–$100k"
              />
            </div>
          </div>

          <div>
            <label htmlFor="drawer-status" className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              id="drawer-status"
              {...register('status')}
              className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="drawer-applied-at" className="block text-sm font-medium text-slate-700 mb-1">
                Applied Date
              </label>
              <input
                id="drawer-applied-at"
                {...register('appliedAt')}
                type="date"
                className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
              />
            </div>
            <div>
              <label htmlFor="drawer-follow-up-date" className="block text-sm font-medium text-slate-700 mb-1">
                Follow-up Date
              </label>
              <input
                id="drawer-follow-up-date"
                {...register('followUpDate')}
                type="date"
                className={cn(INPUT_BASE_CLASS, 'border-slate-300')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="drawer-notes" className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              id="drawer-notes"
              {...register('notes')}
              rows={4}
              className={cn(INPUT_BASE_CLASS, 'border-slate-300 resize-none')}
              placeholder="Any notes about this application..."
            />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={createApplication.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {createApplication.isPending && <Spinner size="sm" />}
            Save
          </button>
        </div>
      </div>
    </>
  );
}
