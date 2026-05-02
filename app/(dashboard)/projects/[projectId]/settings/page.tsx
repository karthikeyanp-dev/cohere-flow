'use client';

import { use, useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Project, WorkflowStage } from '@/types';
import { Loader2, Plus, X, GripVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const COLORS = ['indigo','sky','amber','emerald','rose','violet','orange','teal'] as const;
const COLOR_HEX: Record<string, string> = {
  indigo:'#6366f1',sky:'#0ea5e9',amber:'#f59e0b',
  emerald:'#10b981',rose:'#f43f5e',violet:'#8b5cf6',
  orange:'#f97316',teal:'#14b8a6',
};

export default function ProjectSettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'projects', projectId)).then((snap) => {
      if (snap.exists()) {
        const p = { id: snap.id, ...snap.data() } as Project;
        setProject(p);
        setStages([...p.workflow].sort((a, b) => a.order - b.order));
      }
      setLoading(false);
    });
  }, [projectId]);

  const addStage = () => {
    setStages(prev => [...prev, {
      id: `stage_${Date.now()}`, label: 'New Stage',
      color: 'sky', order: prev.length,
    }]);
  };

  const removeStage = (id: string) => {
    if (stages.length <= 2) return;
    setStages(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  const updateStage = (id: string, field: keyof WorkflowStage, value: string | number) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveWorkflow = async () => {
    if (!project) return;
    setSaving(true);
    await updateDoc(doc(db, 'projects', projectId), { workflow: stages, updatedAt: Date.now() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }}/>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/projects/${projectId}/board`}
          className="p-2 rounded-lg transition-all hover:opacity-70"
          style={{ background: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16}/>
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {project?.name} — Settings
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Configure workflow stages</p>
        </div>
      </div>

      <div className="rounded-xl p-5 space-y-3"
           style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Workflow Stages</h2>
          <button onClick={addStage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Plus size={12}/> Add Stage
          </button>
        </div>

        {stages.map((stage, idx) => (
          <div key={stage.id} className="flex items-center gap-3 p-3 rounded-lg"
               style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
            <GripVertical size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, cursor: 'grab' }}/>
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: COLOR_HEX[stage.color] }}/>
            <input
              value={stage.label}
              onChange={(e) => updateStage(stage.id, 'label', e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            {/* Color picker */}
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => updateStage(stage.id, 'color', c)}
                  className="w-4 h-4 rounded-full transition-transform hover:scale-125"
                  style={{
                    background: COLOR_HEX[c],
                    outline: stage.color === c ? `2px solid white` : 'none',
                    outlineOffset: '1px',
                  }}/>
              ))}
            </div>
            <button onClick={() => removeStage(stage.id)} disabled={stages.length <= 2}
              className="p-1 rounded-md transition-all hover:bg-rose-500/10 disabled:opacity-30"
              style={{ color: '#fb7185' }}>
              <X size={13}/>
            </button>
          </div>
        ))}

        <button onClick={saveWorkflow} disabled={saving}
          className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{
            background: saved ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: saved ? '#34d399' : 'white',
            border: saved ? '1px solid rgba(16,185,129,0.4)' : 'none',
          }}>
          {saving && <Loader2 size={14} className="animate-spin"/>}
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Workflow'}
        </button>
      </div>
    </div>
  );
}
