import api from './api';
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  PaginatedResponse,
  ApiResponse,
  TaskFilters,
} from '../types/task';

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
    const params = new URLSearchParams();
    console.log(params.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    // Assuming the backend handles filtering and pagination and returns PaginatedResponse
    // For now we just call GET /api/tasks and return data directly, we might need to adjust based on API spec.
    const res = await api.get(`/tasks?${params.toString()}`);
    // If backend returns a flat array in `res.data.data` without pagination info, we might have to adapt it.
    // The requirement was: Replace all mock data with live API.
    // Let's assume the backend /api/tasks endpoint doesn't support pagination out of the box (as we just wrote it without).
    // The backend `taskController.getTasks` just returns { success: true, data: tasks }.
    // So we'll map it to the frontend's expected PaginatedResponse structure manually if needed, or just return it.

    // To minimize frontend changes, let's process the flat array returned from backend:
    let filtered: Task[] = res.data.data || [];
    console.log(filtered);

    // Fallback frontend filtering if the backend doesn't implement it yet
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      );
    }
    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter((t) => t.categoryId === filters.category || (t.categoryId as any)?._id === filters.category);
    }
    if (filters.priority) {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = String(a[filters.sortBy as keyof Task] || '');
        const bVal = String(b[filters.sortBy as keyof Task] || '');
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.sortOrder === 'desc' ? -cmp : cmp;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Map the backend Task model to frontend Task interface. 
    // Backend has `categoryId` as an object { _id, name, color, icon } due to populate.
    const mappedData = data.map((t: any) => ({
      ...t,
      id: t._id,
      category: t.categoryId?._id || t.categoryId,
      categoryName: t.categoryId?.name || '',
    }));

    return { data: mappedData, total, page, pageSize, totalPages };
  },

  /**
   * GET /api/tasks/:id
   */
  async getById(id: string): Promise<ApiResponse<Task>> {
    const res = await api.get(`/tasks/${id}`);
    const t = res.data.data;
    const task = {
      ...t,
      id: t._id,
      category: t.categoryId?._id || t.categoryId,
      categoryName: t.categoryId?.name || '',
    };
    return { data: task, message: 'Success', success: true };
  },

  /**
   * POST /api/tasks
   */
  async create(payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
    // Frontend payload uses 'category', backend expects 'categoryId'
    const backendPayload = {
      ...payload,
      categoryId: payload.categoryId,
    };
    console.log('taskService.create: sending payload', backendPayload);
    const res = await api.post('/tasks', backendPayload);
    console.log('taskService.create: response', res.data);
    const t = res.data.data;
    const task = {
      ...t,
      id: t._id,
      category: t.categoryId,
    };
    return { data: task, message: res.data.message, success: true };
  },

  /**
   * PUT /api/tasks/:id
   */
  async update(id: string, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> {
    const backendPayload = { ...payload };
    if (backendPayload.categoryId) {
      (backendPayload as any).categoryId = backendPayload.categoryId;
      delete backendPayload.categoryId;
    }
    const res = await api.put(`/tasks/${id}`, backendPayload);
    const t = res.data.data;
    const task = {
      ...t,
      id: t._id,
      category: t.categoryId,
    };
    return { data: task, message: res.data.message, success: true };
  },

  /**
   * DELETE /api/tasks/:id
   */
  async remove(id: string): Promise<ApiResponse<null>> {
    const res = await api.delete(`/tasks/${id}`);
    return { data: null, message: res.data.message, success: true };
  },

  /**
   * DELETE multiple tasks (fallback for bulk removal since backend only has single DELETE)
   */
  async bulkRemove(ids: string[]): Promise<ApiResponse<null>> {
    // Call delete for each id concurrently
    await Promise.all(ids.map(id => api.delete(`/tasks/${id}`)));
    return { data: null, message: `${ids.length} tasks deleted`, success: true };
  },
};
