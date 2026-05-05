import { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { KanbanBoard } from '@/components/applications/KanbanBoard';
import { ApplicationDrawer } from '@/components/applications/ApplicationDrawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';
import { APPLICATION_STATUSES } from '@/lib/statusTokens';
import type { ApplicationStatus } from '@/types';

export default function Applications() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileStatus, setMobileStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
  const { data, isLoading, isError, refetch } = useApplications({ limit: 100 });

  const applications = data?.items ?? [];
  const filtered = mobileStatus === 'ALL'
    ? applications
    : applications.filter((a) => a.status === mobileStatus);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 space-y-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-slate-500 text-sm">Failed to load applications.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{applications.length} total</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Application
        </button>
      </div>

      {/* Desktop Kanban */}
      <div className="hidden md:block">
        <KanbanBoard applications={applications} />
      </div>

      {/* Mobile list view */}
      <div className="md:hidden space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setMobileStatus('ALL')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              mobileStatus === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {APPLICATION_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setMobileStatus(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                mobileStatus === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">No applications in this category.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((app) => (
              <div key={app.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{app.company}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{app.role}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-slate-400 mt-2">{formatDate(app.appliedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ApplicationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
