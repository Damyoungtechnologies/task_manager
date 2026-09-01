export type Priority = 'low' | 'medium' | 'high';

export type Filter = 'all' | 'pending' | 'completed' | Priority;

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
  completed: boolean;
  createdAt: number;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'completed'>;

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export interface PriorityInfo {
  value: Priority;
  label: string;
  color: string;
}

export const PRIORITIES: PriorityInfo[] = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
];

export const CATEGORIES: string[] = ['Personal', 'School', 'Work', 'Shopping', 'Other'];

export const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function getTaskStats(tasks: Task[]): TaskStats {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  return { total: tasks.length, completed, pending };
}

export function priorityInfo(value: Priority): PriorityInfo {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[0];
}

export function formatDate(date: string): string {
  const parsed = new Date(date + 'T00:00:00');
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0,  ​10);
}

export function isOverdue(task: Task): boolean {
  return !task.completed && task.dueDate.length > 0 && task.dueDate < todayISO();
}