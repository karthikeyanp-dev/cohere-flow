'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const prevCount = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevCount.current) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);

  const recent = notifications.slice(0, 6);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications, ${unreadCount} unread`}
        className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-90 ${shake ? 'animate-shake' : ''}`}
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                style={{ background: '#6366f1' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-80 rounded-xl overflow-hidden animate-fade-in"
               style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-4 py-3"
                 style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="text-xs hover:underline" style={{ color: 'var(--brand)' }}>
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" style={{ color: 'var(--text-muted)' }}/>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
                </div>
              ) : (
                recent.map((n) => (
                  <button key={n.id}
                    onClick={() => { markAsRead(n.id); setOpen(false); }}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-all hover:opacity-80"
                    style={{ background: n.read ? 'transparent' : 'rgba(99,102,241,0.06)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#6366f1' }} />
                    )}
                    <div className={n.read ? 'pl-5' : ''}>
                      <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        <strong>{n.actorName}</strong> assigned you{' '}
                        <strong>&ldquo;{n.taskTitle}&rdquo;</strong>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2.5" style={{ borderTop: '1px solid var(--border)' }}>
              <Link href="/notifications" onClick={() => setOpen(false)}
                className="text-xs font-medium hover:underline" style={{ color: 'var(--brand)' }}>
                View all notifications →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
