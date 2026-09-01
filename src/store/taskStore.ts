import { create } from 'zustand';

import { getTaskStats, type Task, type TaskFormData, type TaskStats } from '@/constants/task';

interface TaskState {
  tasks: Task[];
  stats: TaskStats;

  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, updates: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearCompleted: () => void;
}

const seedTasks: Task[] = [
  {
    id: 'seed-1',
    title: 'Finish React Native assignment',
    description: 'Complete the student task manager appand push the code to GitHub',
    priority: 'high',
    category: 'School',
    dueDate: '2026-09-10',
    completed: false,
    createdAt: Date.now() - 5 * 86400000,
  },
  {
    id: 'seed-2',
    title: 'Review Zustand notes',
    description: 'Go over the cohort-8 loginStore example',
    priority: 'medium',
    category: 'School',
    dueDate: '2026-09-03',
    completed: true,
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: 'seed-3',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread and fruits',
    priority: 'low',
    category: 'Shopping',
    dueDate: '2026-09-04',
    completed: false,
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'seed-4',
    title: 'Morning workout',
    description: '30 minutes of cardio',
    priority: 'medium',
    category: 'Personal',
    dueDate: '2026-09-02',
    completed: true,
    createdAt: Date.now() - 2 * 86400000,
  },
];

function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: seedTasks,
  stats: getTaskStats(seedTasks),

  addTask: (data) =>
    set((state) => {
      const tasks: Task[] = [
        { ...data, id: generateId(), completed: false, createdAt: Date.now() },
        ...state.tasks,
      ];
      return { tasks, stats: getTaskStats(tasks) };
    }),

  updateTask: (id, updates) =>
    set((state) => {
      const tasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
      return { tasks, stats: getTaskStats(tasks) };
    }),

  deleteTask: (id) =>
    set((state) => {
      const tasks = state.tasks.filter((task) => task.id !== id);
      return { tasks, stats: getTaskStats(tasks) };
    }),

  toggleTask: (id) =>
    set((state) => {
      const tasks = state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      return { tasks, stats: getTaskStats(tasks) };
    }),

  clearCompleted: () =>
    set((state) => {
      const tasks = state.tasks.filter((task) => !task.completed);
      return { tasks, stats: getTaskStats(tasks) };
    }),
}));
