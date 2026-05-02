'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FolderKanban, Bell, Users, ShieldCheck, FolderOpen,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';

const memberNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const adminNav = [
  { href: '/admin/projects', label: 'Manage Projects', icon: FolderOpen },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function Sidebar() {
  const { appUser, role } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
             style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h10M4 18h6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-bold text-base gradient-text">Cohere Flow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {memberNav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active ? 'text-white' : 'hover:opacity-100'
              )}
              style={active
                ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
                : { color: 'var(--text-secondary)', opacity: 0.8 }
              }>
              <Icon size={16} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}

        {role === 'admin' && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                 style={{ color: 'var(--text-muted)' }}>
                <ShieldCheck size={12}/> Admin
              </p>
            </div>
            {adminNav.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={active
                    ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
                    : { color: 'var(--text-secondary)', opacity: 0.8 }
                  }>
                  <Icon size={16}/>
                  {label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User chip */}
      {appUser && (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-4"
             style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
            {getInitials(appUser.displayName)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {appUser.displayName}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {appUser.role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
