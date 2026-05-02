'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const nav = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/notifications', label: 'Alerts', icon: Bell },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <nav className="md:hidden flex items-center justify-around h-14 flex-shrink-0"
         style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-1 flex-1 py-2 transition-all"
            style={{ color: active ? '#a5b4fc' : 'var(--text-muted)' }}>
            <div className="relative">
              <Icon size={20} />
              {href === '/notifications' && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                      style={{ background: '#6366f1' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
