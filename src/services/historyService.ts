import api from './api';
import type { HistoryEvent, ApiResponse } from '../types/task';
import { MOCK_HISTORY } from '../data/mockData';

export const historyService = {
  async getAll(params?: { page?: number; limit?: number; search?: string; date?: string; type?: string }): Promise<ApiResponse<HistoryEvent[]> & { total?: number; page?: number; totalPages?: number }> {
    try {
      const res = await api.get('/activities', { params });

      // Map backend Activity model to frontend HistoryEvent interface
      const data = res.data.data.map((a: any) => ({
        id: a._id,
        type: a.action?.toLowerCase().includes('create') ? 'created'
            : a.action?.toLowerCase().includes('delete') ? 'deleted'
            : a.action?.toLowerCase().includes('complete') ? 'completed'
            : a.action?.toLowerCase().includes('login') ? 'login'
            : a.action?.toLowerCase().includes('logout') ? 'logout'
            : 'updated',
        entityType: a.taskId ? 'task' : 'category',
        entityId: a.taskId || 'general',
        entityTitle: a.action,
        description: a.message || a.action,
        userId: a.userId,
        userName: 'User',
        timestamp: a.createdAt || new Date().toISOString(),
      }));

      return { 
        data, 
        message: res.data.message, 
        success: true,
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages
      };
    } catch (err) {
      // Fallback to MOCK_HISTORY if backend API is not reachable
      return { data: MOCK_HISTORY, message: 'Loaded from mock data', success: true };
    }
  },
};

