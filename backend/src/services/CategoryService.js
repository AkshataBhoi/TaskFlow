import Category from '../models/Category.js';
import ActivityService from './ActivityService.js';

class CategoryService {
  async getCategories(userId) {
    return await Category.find();
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
