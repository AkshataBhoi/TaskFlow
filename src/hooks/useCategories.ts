import { useState, useEffect, useCallback } from 'react';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/task';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = async (payload: CreateCategoryPayload) => {
    try {
      await categoryService.create(payload);
      toast.success('Category created successfully');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
    try {
      await categoryService.update(id, payload);
      toast.success('Category updated successfully');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.remove(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return { categories, loading, error, refreshCategories: fetchCategories, createCategory, updateCategory, deleteCategory };
}
