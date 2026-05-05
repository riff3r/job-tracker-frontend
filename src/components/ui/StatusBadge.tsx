import { cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/statusTokens';
import type { ApplicationStatus } from '@/types';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  WISHLIST: 'bg-slate-100 text-slate-600',
  APPLIED: 'bg-blue-100 text-blue-700',
  PHONE_SCREEN: 'bg-yellow-100 text-yellow-700',
  INTERVIEW: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-500',
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
