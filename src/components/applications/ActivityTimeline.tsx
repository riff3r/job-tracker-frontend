import { cn, timeAgo } from '@/lib/utils';
import { STATUS_LABELS, type ActivityLog, type ApplicationStatus } from '@/types';

const STATUS_DOT_COLORS: Record<ApplicationStatus, string> = {
  WISHLIST: 'bg-slate-400',
  APPLIED: 'bg-blue-500',
  PHONE_SCREEN: 'bg-yellow-500',
  INTERVIEW: 'bg-purple-500',
  OFFER: 'bg-green-500',
  REJECTED: 'bg-red-500',
  WITHDRAWN: 'bg-gray-400',
};

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-4">No activity yet.</p>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log, index) => (
        <div key={log.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0',
                STATUS_DOT_COLORS[log.toStatus]
              )}
            />
            {index < logs.length - 1 && (
              <div className="w-px flex-1 bg-slate-200 my-1" />
            )}
          </div>

          <div className="pb-4 flex-1">
            <p className="text-sm text-slate-700">
              {log.fromStatus ? (
                <>
                  <span className="font-medium">
                    {STATUS_LABELS[log.fromStatus]}
                  </span>{' '}
                  →{' '}
                  <span className="font-medium">
                    {STATUS_LABELS[log.toStatus]}
                  </span>
                </>
              ) : (
                <>
                  Added as{' '}
                  <span className="font-medium">
                    {STATUS_LABELS[log.toStatus]}
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {timeAgo(log.changedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
