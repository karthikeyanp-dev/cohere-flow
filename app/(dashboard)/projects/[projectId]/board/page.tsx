'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Project } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import KanbanBoard from '@/components/board/KanbanBoard';
import { Loader2, Settings, Users2 } from 'lucide-react';
import Link from 'next/link';

export default function BoardPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { role } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { tasks, createTask, updateTask, deleteTask } = useTasks(projectId);

  useEffect(() => {
    getDoc(doc(db, 'projects', projectId)).then((snap) => {
      if (snap.exists()) setProject({ id: snap.id, ...snap.data() } as Project);
      setLoading(false);
    });
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }}/>
      </div>
    );
  }

  if (!project) return (
    <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>Project not found.</div>
  );

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{project.name}</h1>
          <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Users2 size={12}/> {project.memberIds.length} member{project.memberIds.length !== 1 ? 's' : ''}
            &nbsp;·&nbsp; {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {role === 'admin' && (
            <Link href={`/projects/${projectId}/settings`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <Settings size={13}/> Settings
            </Link>
          )}
        </div>
      </div>

      {/* Board */}
      <KanbanBoard
        project={project}
        tasks={tasks}
        onCreateTask={createTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}
