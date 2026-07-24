/**
 * taskService.ts
 *
 * All task API calls are isolated here.
 * Currently uses mock data — swap BASE_URL to connect to a real Express+MongoDB backend.
 */

import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  PaginatedResponse,
  ApiResponse,
  TaskFilters,
} from '../types/task';
import { MOCK_TASKS } from '../data/mockData';

// const BASE_URL = 'http://localhost:5000/api'; // ← uncomment for real backend

// Simulated network delay
const delay = (ms = 400) => new Promise<void>((res) => setTimeout(res, ms));

let tasks: Task[] = [...MOCK_TASKS];

export const taskService = {
  /**
   * GET /api/tasks
   * Fetch all tasks with optional filters and pagination
   */
  async getAll(
    filters: TaskFilters = {},
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Task>> {
    await delay();

    let filtered = [...tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy as keyof Task] as string;
        const bVal = b[filters.sortBy as keyof Task] as string;
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.sortOrder === 'desc' ? -cmp : cmp;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { data, total, page, pageSize, totalPages };
  },

  /**
   * GET /api/tasks/:id
   */
  async getById(id: string): Promise<ApiResponse<Task>> {
    await delay(200);
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    return { data: task, message: 'Success', success: true };
  },

  /**
   * POST /api/tasks
   */
  async create(payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
    await delay();
    const newTask: Task = {
      id: `t${Date.now()}`,
      ...payload,
      categoryName: payload.category, // resolved from category id in real app
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks = [newTask, ...tasks];
    return { data: newTask, message: 'Task created', success: true };
  },

  /**
   * PUT /api/tasks/:id
   */
  async update(id: string, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> {
    await delay();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = { ...tasks[index], ...payload, updatedAt: new Date().toISOString() };
    return { data: tasks[index], message: 'Task updated', success: true };
  },

  /**
   * DELETE /api/tasks/:id
   */
  async remove(id: string): Promise<ApiResponse<null>> {
    await delay();
    tasks = tasks.filter((t) => t.id !== id);
    return { data: null, message: 'Task deleted', success: true };
  },

  /**
   * DELETE /api/tasks (bulk)
   */
  async bulkRemove(ids: string[]): Promise<ApiResponse<null>> {
    await delay();
    tasks = tasks.filter((t) => !ids.includes(t.id));
    return { data: null, message: `${ids.length} tasks deleted`, success: true };
  },
};
