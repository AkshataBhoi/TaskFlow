import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  ApiResponse,
} from '../types/task';
import { MOCK_CATEGORIES } from '../data/mockData';

const delay = (ms = 400) => new Promise<void>((res) => setTimeout(res, ms));

let categories: Category[] = [...MOCK_CATEGORIES];

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    await delay();
    return { data: [...categories], message: 'Success', success: true };
  },

  async create(payload: CreateCategoryPayload): Promise<ApiResponse<Category>> {
    await delay();
    const newCategory: Category = {
      id: `c${Date.now()}`,
      ...payload,
      taskCount: 0,
      completedCount: 0,
      createdAt: new Date().toISOString(),
    };
    categories = [newCategory, ...categories];
    return { data: newCategory, message: 'Category created', success: true };
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<Category>> {
    await delay();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories[index] = { ...categories[index], ...payload };
    return { data: categories[index], message: 'Category updated', success: true };
  },

  async remove(id: string): Promise<ApiResponse<null>> {
    await delay();
    categories = categories.filter((c) => c.id !== id);
    return { data: null, message: 'Category deleted', success: true };
  },
};
