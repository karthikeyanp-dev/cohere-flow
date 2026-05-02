// hooks/useTasks.ts
'use client';

import { useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Task } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useTasks(projectId: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const q = query(
      collection(db, 'projects', projectId, 'tasks'),
      where('projectId', '==', projectId)
    );
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
      setLoading(false);
    });
    return unsub;
  }, [projectId]);

  const createTask = async (data: {
    title: string;
    description: string;
    status: string;
    assigneeId: string | null;
  }) => {
    if (!user) return;
    const task = {
      ...data,
      projectId,
      creatorId: user.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const ref = await addDoc(collection(db, 'projects', projectId, 'tasks'), task);

    // Fire notification if assigned
    if (data.assigneeId && data.assigneeId !== user.uid) {
      const token = await user.getIdToken();
      await fetch('/api/notifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          recipientId: data.assigneeId,
          taskId: ref.id,
          projectId,
          taskTitle: data.title,
          actorName: user.displayName || user.email || 'Someone',
        }),
      });
    }
  };

  const updateTask = async (taskId: string, data: Partial<Task>, prevAssigneeId?: string | null) => {
    if (!user) return;
    await updateDoc(doc(db, 'projects', projectId, 'tasks', taskId), {
      ...data,
      updatedAt: Date.now(),
    });
    // Notify on re-assignment
    if (data.assigneeId && data.assigneeId !== prevAssigneeId && data.assigneeId !== user.uid) {
      const token = await user.getIdToken();
      await fetch('/api/notifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          recipientId: data.assigneeId,
          taskId,
          projectId,
          taskTitle: data.title || 'A task',
          actorName: user.displayName || user.email || 'Someone',
        }),
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'projects', projectId, 'tasks', taskId));
  };

  return { tasks, loading, createTask, updateTask, deleteTask };
}
