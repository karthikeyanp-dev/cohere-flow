'use client';

import { useState } from 'react';
import { Task, Project } from '@/types';
import { X, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  task: Task;
  project: Project;
  onClose: () => void;
  onUpdate: (data: Partial<Task>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function TaskModal({ task, project, onClose, onUpdate, onDelete }: Props) {
  const { appUser, role } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [assigneeId, setAssigneeId] = useState<string | null>(task.assigneeId);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const sortedStages = [...project.workflow].sort((a, b) => a.order - b.order);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ title, description, status, assigneeId });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  const inputBase = {
    background: 'var(--bg-base)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', width: '100%', borderRadius: '8px',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl animate-fade-in overflow-hidden"
           style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
             style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Edit Task
          </span>
          <div className="flex items-center gap-2">
            {(role === 'admin' || appUser?.uid === task.creatorId) && (
              <button onClick={handleDelete} disabled={deleting}
                className="p-1.5 rounded-lg transition-all hover:bg-rose-500/10"
                style={{ color: '#fb7185' }}>
                {deleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg transition-all hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}>
              <X size={16}/>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 text-sm outline-none"
              style={inputBase}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="px-3 py-2 text-sm outline-none resize-none"
              style={inputBase}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                {sortedStages.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Assignee</label>
              <select value={assigneeId || ''} onChange={(e) => setAssigneeId(e.target.value || null)}
                className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Unassigned</option>
                {project.memberIds.map((uid) => (
                  <option key={uid} value={uid}>{uid === appUser?.uid ? 'Me' : uid.slice(0, 8) + '…'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
              {saving && <Loader2 size={14} className="animate-spin"/>}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-70"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
