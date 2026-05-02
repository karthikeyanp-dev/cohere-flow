'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import Link from 'next/link';
import { FolderKanban, Plus, Loader2, ArrowRight, Users2 } from 'lucide-react';

export default function DashboardPage() {
  const { appUser, role } = useAuth();
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }}/>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome, {appUser?.displayName?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {activeProjects.length > 0
              ? `You have ${activeProjects.length} active project${activeProjects.length !== 1 ? 's' : ''}`
              : 'No projects assigned yet'}
          </p>
        </div>
        {role === 'admin' && (
          <Link href="/admin/projects"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
            <Plus size={16}/> New Project
          </Link>
        )}
      </div>

      {/* Stats strip */}
      {activeProjects.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Active Projects', value: activeProjects.length, color: '#6366f1' },
            { label: 'Total Tasks', value: '-', color: '#8b5cf6' },
            { label: 'Your Role', value: role === 'admin' ? 'Admin' : 'Member', color: '#06b6d4' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-4"
                 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {activeProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
             style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
               style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <FolderKanban size={28} style={{ color: '#6366f1' }}/>
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {role === 'admin' ? 'Create your first project' : 'No projects assigned yet'}
          </h2>
          <p className="text-sm max-w-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {role === 'admin'
              ? 'Set up a project, configure your workflow, and invite your team.'
              : 'Ask your admin to invite you to a project to get started.'}
          </p>
          {role === 'admin' && (
            <Link href="/admin/projects"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
              <Plus size={16}/> Create Project
            </Link>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            YOUR PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}/board`}
                className="group rounded-xl p-5 transition-all hover:border-indigo-500/50 hover:-translate-y-0.5"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                       style={{ background: 'rgba(99,102,241,0.15)' }}>
                    <FolderKanban size={18} style={{ color: '#6366f1' }}/>
                  </div>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                              style={{ color: '#6366f1' }}/>
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {p.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Users2 size={12}/>
                    {p.memberIds.length} member{p.memberIds.length !== 1 ? 's' : ''}
                  </div>
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
        </div>
      )}
    </div>
  );
}

function stageColorHex(color: string): string {
  const map: Record<string, string> = {
    indigo: '#6366f1', sky: '#0ea5e9', amber: '#f59e0b',
    emerald: '#10b981', rose: '#f43f5e', violet: '#8b5cf6',
    orange: '#f97316', teal: '#14b8a6',
  };
  return map[color] || '#6366f1';
}
