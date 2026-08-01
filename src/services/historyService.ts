import api from './api';
import type { HistoryEvent, ApiResponse } from '../types/task';
import { MOCK_HISTORY } from '../data/mockData';

export const historyService = {
  async getAll(): Promise<ApiResponse<HistoryEvent[]>> {
    try {
      const res = await api.get('/activities');

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

      return { data, message: res.data.message, success: true };
    } catch (err) {
      // Fallback to MOCK_HISTORY if backend API is not reachable
      return { data: MOCK_HISTORY, message: 'Loaded from mock data', success: true };
    }
  },
};

