'use client';

import { useState } from 'react';
import {
  DndContext, DragEndEvent, DragStartEvent,
  closestCenter, PointerSensor, useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { Project, Task } from '@/types';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from '@/components/tasks/TaskModal';

interface Props {
  project: Project;
  tasks: Task[];
  onCreateTask: (data: { title: string; description: string; status: string; assigneeId: string | null }) => Promise<void>;
  onUpdateTask: (id: string, data: Partial<Task>, prevAssignee?: string | null) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export default function KanbanBoard({ project, tasks, onCreateTask, onUpdateTask, onDeleteTask }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const displayTasks = tasks;

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  }));

  const getTasksByStage = (stageId: string) =>
    displayTasks.filter((t) => t.status === stageId);

  const handleDragStart = (e: DragStartEvent) => {
    const task = displayTasks.find((t) => t.id === e.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;

    const task = displayTasks.find((t) => t.id === active.id);
    if (!task) return;

    let newStatus = over.id as string;
    const overTask = displayTasks.find((t) => t.id === over.id);
    if (overTask) newStatus = overTask.status;

    if (newStatus !== task.status && project.workflow.find((s) => s.id === newStatus)) {
      await onUpdateTask(task.id, { status: newStatus });
    }
  };

  const sortedStages = [...project.workflow].sort((a, b) => a.order - b.order);

  return (
    <div className="h-full flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1" style={{ minHeight: 0 }}>
          {sortedStages.map((stage) => (
            <Column
              key={stage.id}
              stage={stage}
              tasks={getTasksByStage(stage.id)}
              projectId={project.id}
              projectMembers={project.memberIds}
              onCreateTask={onCreateTask}
              onCardClick={(task) => setSelectedTask(task)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200 }}>
          {activeTask && (
            <TaskCard task={activeTask} onClick={() => {}} isDragging />
          )}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          project={project}
          onClose={() => setSelectedTask(null)}
          onUpdate={(data) => onUpdateTask(selectedTask.id, data, selectedTask.assigneeId)}
          onDelete={() => { onDeleteTask(selectedTask.id); setSelectedTask(null); }}
        />
      )}
    </div>
  );
}
