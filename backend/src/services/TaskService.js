import Task from '../models/Task.js';
import ActivityService from './ActivityService.js';

class TaskService {
  async getTasks(userId) {
    return await Task.find({ userId }).populate('categoryId', 'name color icon');
  }

  async getTaskById(userId, taskId) {
    const task = await Task.findOne({ _id: taskId, userId }).populate('categoryId', 'name color icon');
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async createTask(userId, taskData) {
    const task = await Task.create({
      ...taskData,
      userId,
    });

    await ActivityService.logActivity(
      userId,
      task._id,
      'TASK_CREATED',
      `Created task "${task.title}"`
    );

    return task;
  }

  async updateTask(userId, taskId, updateData) {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new Error('Task not found');
    }

    if (updateData.status === 'completed' && task.status === 'completed') {
      await ActivityService.logActivity(
        userId,
        task._id,
        'TASK_COMPLETED',
        `Completed task "${task.title}"`
      );
    } else {
      await ActivityService.logActivity(
        userId,
        task._id,
        'TASK_UPDATED',
        `Updated task "${task.title}"`
      );
    }

    return task;
  }

  async deleteTask(userId, taskId) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      throw new Error('Task not found');
    }

    await ActivityService.logActivity(
      userId,
      taskId,
      'TASK_DELETED',
      `Deleted task "${task.title}"`
    );

    return task;
  }
}

export default new TaskService();
