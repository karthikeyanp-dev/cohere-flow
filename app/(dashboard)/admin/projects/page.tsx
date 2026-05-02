'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';
import { AppUser, Project } from '@/types';
import { Plus, Archive, Loader2, Users, Settings, X, Check } from 'lucide-react';
import { DEFAULT_WORKFLOW } from '@/lib/utils';
import Link from 'next/link';

export default function AdminProjectsPage() {
  const { user } = useAuth();
  const { projects, loading, createProject, archiveProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDocs(collection(db, 'users')).then((snap) => {
      setUsers(snap.docs.map((d) => d.data() as AppUser));
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;
    setSubmitting(true);
    const members = Array.from(new Set([user.uid, ...selectedMembers]));
    await createProject({ name: name.trim(), description, memberIds: members });
    setName(''); setDescription(''); setSelectedMembers([]); setShowForm(false);
    setSubmitting(false);
  };

  const toggleMember = (uid: string) => {
    setSelectedMembers(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const inputBase = {
    background: 'var(--bg-raised)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', width: '100%', borderRadius: '8px',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }}/>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Projects</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
          {showForm ? <X size={15}/> : <Plus size={15}/>}
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate}
          className="mb-6 rounded-xl p-5 space-y-4 animate-fade-in"
          style={{ background: 'var(--bg-surface)', border: '1px solid rgba(99,102,241,0.4)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Project</h2>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Project Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="e.g. Mobile App Redesign"
              className="px-3 py-2 text-sm outline-none"
              style={inputBase}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2} placeholder="What is this project about?"
              className="px-3 py-2 text-sm outline-none resize-none"
              style={inputBase}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Invite Members
            </label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => {
                const selected = selectedMembers.includes(u.uid);
                return (
                  <button key={u.uid} type="button" onClick={() => toggleMember(u.uid)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: selected ? 'rgba(99,102,241,0.2)' : 'var(--bg-raised)',
                      border: `1px solid ${selected ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`,
                      color: selected ? '#a5b4fc' : 'var(--text-secondary)',
                    }}>
                    {selected && <Check size={11}/>}
                    {u.displayName}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Default workflow: To Do → In Progress → In Review → Done (editable in project settings)
          </p>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
            {submitting && <Loader2 size={14} className="animate-spin"/>}
            {submitting ? 'Creating…' : 'Create Project'}
          </button>
        </form>
      )}

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl p-4 transition-all hover:border-indigo-500/30"
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="min-w-0">
              <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
              <p className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><Users size={11}/> {p.memberIds.length} members</span>
                <span>· {p.workflow.length} stages</span>
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link href={`/projects/${p.id}/settings`}
                className="p-2 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
                <Settings size={14}/>
              </Link>
              <button onClick={() => archiveProject(p.id)}
                title="Archive project"
                className="p-2 rounded-lg transition-all hover:bg-rose-500/10"
                style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}>
                <Archive size={14}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
