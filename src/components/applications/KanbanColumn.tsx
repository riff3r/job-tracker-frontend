import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { ApplicationCard } from './ApplicationCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Application, ApplicationStatus } from '@/types';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex-shrink-0 w-72">
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge status={status} />
        <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'min-h-24 rounded-lg p-2 space-y-2 transition-colors',
          isOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-300' : 'bg-slate-100 border-2 border-transparent'
        )}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex items-center justify-center h-16">
            <p className="text-xs text-slate-400">No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
