import Task from '../models/Task.js';
import ActivityService from './ActivityService.js';

class DashboardService {
  async getStatistics(userId) {
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId, status: 'pending' });
    const highPriorityTasks = await Task.countDocuments({ userId, priority: 'high' });

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      highPriority: highPriorityTasks,
    };
  }

  async getRecentActivity(userId) {
    const result = await ActivityService.getUserActivities(userId, { limit: 5 });
    return result.data;
  }

  async getDashboardData(userId) {
    const [statistics, recentActivity] = await Promise.all([
      this.getStatistics(userId),
      this.getRecentActivity(userId),
    ]);

    return {
      statistics,
      recentActivity,
    };
  }
}

export default new DashboardService();
