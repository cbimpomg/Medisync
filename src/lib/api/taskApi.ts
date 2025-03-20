import { api } from './index';
import type { Task } from '../services/taskService';

export const taskApi = {
  getAll: () => api.get<Task[]>('/tasks'),

  getById: (taskId: string) => api.get<Task>(`/tasks/${taskId}`),

  create: (data: {
    title: string;
    patientId: string;
    assignedTo: string;
    priority: string;
    dueDate: string;
    description: string;
  }) => api.post<Task>('/tasks', data),

  update: (taskId: string, data: { status?: string; notes?: string }) =>
    api.put<Task>(`/tasks/${taskId}`, data),

  delete: (taskId: string) => api.delete(`/tasks/${taskId}`)
};