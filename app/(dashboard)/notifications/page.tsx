'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { formatRelativeTime } from '@/lib/utils';
import { Bell, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotifications();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
            <CheckCheck size={14}/> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
             style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border)' }}>
          <Bell size={32} className="mb-4" style={{ color: 'var(--text-muted)' }}/>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button key={n.id}
              onClick={() => {
                markAsRead(n.id);
                router.push(`/projects/${n.projectId}/board`);
              }}
              className="w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all hover:opacity-90"
              style={{
                background: n.read ? 'var(--bg-surface)' : 'rgba(99,102,241,0.08)',
                border: `1px solid ${n.read ? 'var(--border)' : 'rgba(99,102,241,0.25)'}`,
              }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(99,102,241,0.15)' }}>
                <Bell size={16} style={{ color: '#6366f1' }}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  <strong>{n.actorName}</strong> assigned you{' '}
                  <strong>&ldquo;{n.taskTitle}&rdquo;</strong>
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {formatRelativeTime(n.createdAt)}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#6366f1' }}/>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
