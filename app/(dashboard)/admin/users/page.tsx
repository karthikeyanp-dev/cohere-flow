'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { AppUser } from '@/types';
import { Loader2, ShieldCheck, User } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    setUsers(snap.docs.map((d) => d.data() as AppUser));
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (user: AppUser) => {
    setUpdating(user.uid);
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    await updateDoc(doc(db, 'users', user.uid), { role: newRole });
    setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
    setUpdating(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }}/>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>User Directory</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {users.length} registered user{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.uid} className="flex items-center gap-4 p-4 rounded-xl transition-all"
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
              {getInitials(u.displayName)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{u.displayName}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                 style={{
                   background: u.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'var(--bg-raised)',
                   color: u.role === 'admin' ? '#a5b4fc' : 'var(--text-muted)',
                   border: `1px solid ${u.role === 'admin' ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                 }}>
              {u.role === 'admin' ? <ShieldCheck size={11}/> : <User size={11}/>}
              {u.role}
            </div>

            {/* Toggle button */}
            <button onClick={() => toggleRole(u)} disabled={updating === u.uid}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              {updating === u.uid
                ? <Loader2 size={12} className="animate-spin"/>
                : u.role === 'admin' ? 'Demote' : 'Make Admin'
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
