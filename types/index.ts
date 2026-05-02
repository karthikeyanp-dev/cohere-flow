// types/index.ts

export type UserRole = 'admin' | 'member';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  createdAt: number;
}

export interface WorkflowStage {
  id: string;
  label: string;
  color: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  createdBy: string;
  memberIds: string[];
  workflow: WorkflowStage[];
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // workflow stage id
  assigneeId: string | null;
  creatorId: string;
  projectId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: 'task_assigned';
  taskId: string;
  projectId: string;
  taskTitle: string;
  actorName: string;
  read: boolean;
  createdAt: number;
}
