import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats } from '../types/task';
import { dashboardService } from '../services/dashboardService';
import toast from 'react-hot-toast';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getDashboardData();
      setStats(res.data.statistics);
      setActivities(res.data.recentActivity);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  return { stats, activities, loading, error, refresh: fetchDashboardData };
}
