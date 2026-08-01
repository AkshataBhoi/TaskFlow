import api from './api';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  ApiResponse,
} from '../types/task';

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    const res = await api.get('/categories');
    
    const data = res.data.data.map((c: any) => ({
      ...c,
      id: c._id,
      taskCount:      c.taskCount      ?? 0,
      completedCount: c.completedCount ?? 0,
    }));

    return { data, message: res.data.message, success: true };
  },

  async create(payload: CreateCategoryPayload): Promise<ApiResponse<Category>> {
    const res = await api.post('/categories', payload);
    const data = { ...res.data.data, id: res.data.data._id, taskCount: 0, completedCount: 0 };
    return { data, message: res.data.message, success: true };
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<Category>> {
    const res = await api.put(`/categories/${id}`, payload);
    const data = { ...res.data.data, id: res.data.data._id };
    return { data, message: res.data.message, success: true };
  },

  async remove(id: string): Promise<ApiResponse<null>> {
    const res = await api.delete(`/categories/${id}`);
    return { data: null, message: res.data.message, success: true };
  },
};
