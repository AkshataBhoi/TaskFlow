import api from './api';
import type { ApiResponse, DashboardStats } from '../types/task';

export { type DashboardStats };

export interface DashboardData {
  statistics: DashboardStats;
  recentActivity: any[];
}

export const dashboardService = {
  async getStatistics(): Promise<ApiResponse<DashboardStats>> {
    const res = await api.get('/dashboard/statistics');
    return res.data;
  },

  async getRecentActivity(): Promise<ApiResponse<any[]>> {
    const res = await api.get('/dashboard/activity');
    return res.data;
  },

  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    const res = await api.get('/dashboard');
    return res.data;
  },
};
