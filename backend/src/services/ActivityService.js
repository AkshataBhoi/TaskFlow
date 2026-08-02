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

  async getUserActivities(userId, { page = 1, limit = 20, search, date, type } = {}) {
    const query = { userId };

    if (search) {
      query.$or = [
        { message: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      if (type === 'created') query.action = { $regex: 'create', $options: 'i' };
      else if (type === 'deleted') query.action = { $regex: 'delete', $options: 'i' };
      else if (type === 'completed') query.action = { $regex: 'complete', $options: 'i' };
      else if (type === 'login') query.action = { $regex: 'login', $options: 'i' };
      else if (type === 'logout') query.action = { $regex: 'logout', $options: 'i' };
      else if (type === 'updated') query.action = { $regex: 'update', $options: 'i' };
    }

    if (date) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      if (date === 'today') {
        query.createdAt = { $gte: start, $lt: end };
      } else if (date === 'yesterday') {
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        query.createdAt = { $gte: start, $lt: end };
      } else if (date !== 'all') {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          d.setHours(0, 0, 0, 0);
          const nextDay = new Date(d);
          nextDay.setDate(nextDay.getDate() + 1);
          query.createdAt = { $gte: d, $lt: nextDay };
        }
      }
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Activity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('taskId', 'title'),
      Activity.countDocuments(query)
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}

export default new ActivityService();
