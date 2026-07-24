import { useState, useEffect, useCallback } from 'react';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/task';
import { categoryService } from '../services/categoryService';

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = async (payload: CreateCategoryPayload) => {
    await categoryService.create(payload);
    fetchCategories();
  };

  const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
    await categoryService.update(id, payload);
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    await categoryService.remove(id);
    fetchCategories();
  };

  return { categories, loading, error, refresh: fetchCategories, createCategory, updateCategory, deleteCategory };
}
