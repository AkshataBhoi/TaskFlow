import api from './api';
import type { HistoryEvent, ApiResponse } from '../types/task';

export const historyService = {
  async getAll(): Promise<ApiResponse<HistoryEvent[]>> {
    const res = await api.get('/activities');
    
    // Map backend Activity model to frontend HistoryEvent interface
    const data = res.data.data.map((a: any) => ({
      id: a._id,
      type: 'event', // Generic type since backend just has 'action' string
      entityType: a.taskId ? 'task' : 'category',
      entityId: a.taskId || 'general',
      entityTitle: a.action, // We'll map the action text here
      description: a.message,
      userId: a.userId,
      userName: 'User', // Would be returned by populate if setup
      timestamp: a.createdAt,
    }));

    return { data, message: res.data.message, success: true };
  },
};
