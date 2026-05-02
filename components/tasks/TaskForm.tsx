'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  defaultStatus: string;
  projectId: string;
  projectMembers: string[];
  onSubmit: (data: { title: string; description: string; status: string; assigneeId: string | null }) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ defaultStatus, projectMembers, onSubmit, onCancel }: Props) {
  const { appUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onSubmit({ title: title.trim(), description, status: defaultStatus, assigneeId });
    setLoading(false);
  };

  const inputBase = {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', width: '100%', borderRadius: '8px',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title…"
        required
        className="px-3 py-2 text-sm outline-none"
        style={inputBase}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="px-3 py-2 text-xs outline-none resize-none"
        style={inputBase}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
      />
      <select value={assigneeId || ''} onChange={(e) => setAssigneeId(e.target.value || null)}
        className="px-3 py-2 text-xs rounded-lg outline-none"
        style={{ ...inputBase }}>
        <option value="">Assign to…</option>
        {appUser && <option value={appUser.uid}>Me</option>}
        {projectMembers.filter(id => id !== appUser?.uid).map((uid) => (
          <option key={uid} value={uid}>{uid.slice(0, 10)}…</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
          {loading && <Loader2 size={12} className="animate-spin"/>}
          {loading ? 'Adding…' : 'Add Task'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-70"
          style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
          <X size={12}/>
        </button>
      </div>
    </form>
  );
}
