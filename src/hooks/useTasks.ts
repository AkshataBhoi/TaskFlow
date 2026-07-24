import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskFilters } from '../types/task';
import { taskService } from '../services/taskService';

export function useTasks(initialFilters: TaskFilters = {}, pageSize = 10) {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]         = useState(1);
  const [filters, setFilters]   = useState<TaskFilters>(initialFilters);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.getAll(filters, page, pageSize);
      setTasks(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [filters]);

  const createTask = async (payload: CreateTaskPayload) => {
    await taskService.create(payload);
    fetchTasks();
  };

  const updateTask = async (id: string, payload: UpdateTaskPayload) => {
    await taskService.update(id, payload);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await taskService.remove(id);
    fetchTasks();
  };

  const bulkDeleteTasks = async (ids: string[]) => {
    await taskService.bulkRemove(ids);
    fetchTasks();
  };

  return {
    tasks,
    total,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkDeleteTasks,
  };
}
