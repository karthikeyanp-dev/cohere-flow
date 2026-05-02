// hooks/useProjects.ts
'use client';

import { useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Project } from '@/types';
import { DEFAULT_WORKFLOW } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function useProjects() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Admins see all projects; members see only their own
    const q = role === 'admin'
      ? query(collection(db, 'projects'), where('status', '==', 'active'))
      : query(collection(db, 'projects'), where('memberIds', 'array-contains', user.uid), where('status', '==', 'active'));

    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
      setLoading(false);
    });
    return unsub;
  }, [user, role]);

  const createProject = async (data: { name: string; description: string; memberIds: string[] }) => {
    if (!user) return;
    await addDoc(collection(db, 'projects'), {
      ...data,
      status: 'active',
      createdBy: user.uid,
      workflow: DEFAULT_WORKFLOW,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const archiveProject = async (id: string) => {
    await updateDoc(doc(db, 'projects', id), { status: 'archived', updatedAt: Date.now() });
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: Date.now() });
  };

  return { projects, loading, createProject, archiveProject, updateProject };
}
