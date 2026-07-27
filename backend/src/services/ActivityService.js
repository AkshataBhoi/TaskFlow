import Activity from '../models/Activity.js';

class ActivityService {
  async logActivity(userId, taskId, action, message) {
    return await Activity.create({
      userId,
      taskId: taskId || null,
      action,
      message,
    });
  }

  async getUserActivities(userId) {
    return await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .populate('taskId', 'title');
  }
}

export default new ActivityService();
