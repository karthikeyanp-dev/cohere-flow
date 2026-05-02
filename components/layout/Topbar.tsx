'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';
import NotificationBell from '@/components/notifications/NotificationBell';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Topbar() {
  const { appUser, signOut } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-14 flex-shrink-0"
            style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
      {/* Mobile logo */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h10M4 18h6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-bold text-sm gradient-text">Cohere Flow</span>
      </div>

      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <NotificationBell />

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
            {appUser ? getInitials(appUser.displayName) : '?'}
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-20 w-52 rounded-xl p-1 animate-fade-in"
                   style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {appUser?.displayName}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {appUser?.email}
                  </p>
                </div>
                <button onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-rose-500/10"
                  style={{ color: '#fb7185' }}>
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
