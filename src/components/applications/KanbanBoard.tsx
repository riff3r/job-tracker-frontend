import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { APPLICATION_STATUSES } from '@/lib/statusTokens';
import type { Application, ApplicationStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { useUpdateApplication } from '@/mutations/useUpdateApplication';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/utils';

interface KanbanBoardProps {
  applications: Application[];
}

export function KanbanBoard({ applications }: KanbanBoardProps) {
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const updateApplication = useUpdateApplication();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const app = applications.find((a) => a.id === event.active.id);
    if (app) setActiveApplication(app);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveApplication(null);

    if (!over) return;

    const activeApp = applications.find((a) => a.id === active.id);
    const newStatus = over.id as ApplicationStatus;

    if (!activeApp || activeApp.status === newStatus) return;

    updateApplication.mutate(
      { id: activeApp.id, input: { status: newStatus } },
      {
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to update status'));
        },
      }
    );
  }

  const grouped = APPLICATION_STATUSES.reduce<Record<ApplicationStatus, Application[]>>(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<ApplicationStatus, Application[]>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {APPLICATION_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={grouped[status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication && (
          <div className="rotate-1 opacity-90">
            <ApplicationCard application={activeApplication} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
