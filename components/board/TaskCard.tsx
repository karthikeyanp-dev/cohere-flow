'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { GripVertical, User } from 'lucide-react';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

export default function TaskCard({ task, onClick, isDragging }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id });

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.3 : 1,
    background: 'var(--bg-raised)',
    border: '1px solid var(--border)',
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={cn(
        'group rounded-lg p-3 cursor-pointer transition-all',
        isDragging ? 'shadow-xl rotate-1' : ''
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Drag task"
          aria-roledescription="draggable">
          <GripVertical size={14}/>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug truncate" style={{ color: 'var(--text-primary)' }}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {formatRelativeTime(task.createdAt)}
            </span>
            {task.assigneeId ? (
              <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold"
                   style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
                {task.assigneeId.slice(0, 2).toUpperCase()}
              </div>
            ) : (
              <div className="w-5 h-5 rounded-md flex items-center justify-center"
                   style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                <User size={10}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
