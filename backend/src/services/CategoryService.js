import Category from '../models/Category.js';
import Task from '../models/Task.js';
import ActivityService from './ActivityService.js';

class CategoryService {
  async getCategories(userId) {
    // Get all categories for this user
    const categories = await Category.find({ userId }).lean();

    // Aggregate task counts per category in one query
    const taskAgg = await Task.aggregate([
      { $match: { userId: userId.toString ? userId : String(userId) } },
      {
        $group: {
          _id: { $toString: '$categoryId' },
          taskCount:      { $sum: 1 },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        },
      },
    ]);

    // Build a lookup map for O(1) access
    const countMap = {};
    taskAgg.forEach((a) => { countMap[a._id] = a; });

    // Merge counts into categories
    return categories.map((cat) => {
      const counts = countMap[String(cat._id)] || { taskCount: 0, completedCount: 0 };
      return {
        ...cat,
        taskCount:      counts.taskCount,
        completedCount: counts.completedCount,
      };
    });
  }

  async getCategoryById(userId, categoryId) {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(userId, categoryData) {
    const category = await Category.create({
      ...categoryData,
      userId,
    });

    await ActivityService.logActivity(
      userId,
      null,
      'CATEGORY_CREATED',
      `Created category "${category.name}"`
    );

    return category;
  }

  async updateCategory(userId, categoryId, updateData) {
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new Error('Category not found');
    }

    await ActivityService.logActivity(
      userId,
      null,
      'CATEGORY_UPDATED',
      `Updated category "${category.name}"`
    );

    return category;
  }

  async deleteCategory(userId, categoryId) {
    const category = await Category.findOneAndDelete({ _id: categoryId, userId });
    
    if (!category) {
      throw new Error('Category not found');
    }

    await ActivityService.logActivity(
      userId,
      null,
      'CATEGORY_DELETED',
      `Deleted category "${category.name}"`
    );

    return category;
  }
}

export default new CategoryService();
