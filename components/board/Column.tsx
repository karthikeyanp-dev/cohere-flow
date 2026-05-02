'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { WorkflowStage, Task } from '@/types';
import { STAGE_COLORS } from '@/lib/utils';
import TaskCard from './TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import { Plus } from 'lucide-react';

const COLOR_HEX: Record<string, string> = {
  indigo: '#6366f1', sky: '#0ea5e9', amber: '#f59e0b',
  emerald: '#10b981', rose: '#f43f5e', violet: '#8b5cf6',
  orange: '#f97316', teal: '#14b8a6',
};

interface Props {
  stage: WorkflowStage;
  tasks: Task[];
  projectId: string;
  projectMembers: string[];
  onCreateTask: (data: { title: string; description: string; status: string; assigneeId: string | null }) => Promise<void>;
  onCardClick: (task: Task) => void;
}

export default function Column({ stage, tasks, projectId, projectMembers, onCreateTask, onCardClick }: Props) {
  const [showForm, setShowForm] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.indigo;
  const hex = COLOR_HEX[stage.color] || '#6366f1';

  return (
    <div className="flex flex-col flex-shrink-0 w-72 rounded-xl overflow-hidden"
         style={{ background: 'var(--bg-surface)', border: `1px solid ${isOver ? hex : 'var(--border)'}`, transition: 'border-color 0.15s' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
           style={{ borderBottom: '1px solid var(--border)', borderLeft: `3px solid ${hex}` }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{stage.label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
            {tasks.length}
          </span>
        </div>
        <button onClick={() => setShowForm(true)}
          aria-label={`Add task to ${stage.label}`}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:opacity-80"
          style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}>
          <Plus size={13}/>
        </button>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onCardClick(task)} />
          ))}
        </SortableContext>
      </div>

      {/* Inline create form */}
      {showForm && (
        <div className="p-2 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <TaskForm
            defaultStatus={stage.id}
            projectId={projectId}
            projectMembers={projectMembers}
            onSubmit={async (data) => { await onCreateTask(data); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
