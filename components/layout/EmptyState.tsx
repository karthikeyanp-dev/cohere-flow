'use client';

import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
           style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 0 30px rgba(99,102,241,0.05)' }}>
        <Icon size={32} style={{ color: 'var(--brand)' }} />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm max-w-sm mb-8" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        {description}
      </p>
      {action && (
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {action}
        </div>
      )}
    </div>
  );
}
