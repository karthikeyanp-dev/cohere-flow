'use client';

import { useProjects } from '@/hooks/useProjects';
import Link from 'next/link';
import { FolderKanban, ArrowRight, Users2, Loader2 } from 'lucide-react';

function stageColorHex(color: string): string {
  const map: Record<string, string> = {
    indigo: '#6366f1', sky: '#0ea5e9', amber: '#f59e0b',
    emerald: '#10b981', rose: '#f43f5e', violet: '#8b5cf6',
    orange: '#f97316', teal: '#14b8a6',
  };
  return map[color] || '#6366f1';
}

export default function ProjectsPage() {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }}/>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Projects</h1>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
             style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border)' }}>
          <FolderKanban size={32} className="mb-4" style={{ color: 'var(--text-muted)' }}/>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You haven&apos;t been added to any projects yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}/board`}
              className="group rounded-xl p-5 transition-all hover:border-indigo-500/50 hover:-translate-y-0.5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                     style={{ background: 'rgba(99,102,241,0.15)' }}>
                  <FolderKanban size={18} style={{ color: '#6366f1' }}/>
                </div>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: '#6366f1', marginTop: '4px' }}/>
              </div>
              <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{p.name}</h2>
              <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                {p.description || 'No description'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Users2 size={12}/> {p.memberIds.length} member{p.memberIds.length !== 1 ? 's' : ''}
                </span>
                <div className="flex gap-1">
                  {p.workflow.slice(0, 4).map((s) => (
                    <span key={s.id} className="w-2 h-2 rounded-full"
                          style={{ background: stageColorHex(s.color) }}/>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
