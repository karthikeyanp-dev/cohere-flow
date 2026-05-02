// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  indigo:  { bg: 'bg-indigo-500/20',  text: 'text-indigo-400',  border: 'border-indigo-500' },
  sky:     { bg: 'bg-sky-500/20',     text: 'text-sky-400',     border: 'border-sky-500' },
  amber:   { bg: 'bg-amber-500/20',   text: 'text-amber-400',   border: 'border-amber-500' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' },
  rose:    { bg: 'bg-rose-500/20',    text: 'text-rose-400',    border: 'border-rose-500' },
  violet:  { bg: 'bg-violet-500/20',  text: 'text-violet-400',  border: 'border-violet-500' },
  orange:  { bg: 'bg-orange-500/20',  text: 'text-orange-400',  border: 'border-orange-500' },
  teal:    { bg: 'bg-teal-500/20',    text: 'text-teal-400',    border: 'border-teal-500' },
};

export const DEFAULT_WORKFLOW = [
  { id: 'todo',      label: 'To Do',      color: 'indigo',  order: 0 },
  { id: 'inprog',    label: 'In Progress', color: 'amber',  order: 1 },
  { id: 'review',   label: 'In Review',   color: 'violet', order: 2 },
  { id: 'done',     label: 'Done',        color: 'emerald', order: 3 },
];
