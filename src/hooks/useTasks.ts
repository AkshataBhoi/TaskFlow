import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskFilters } from '../types/task';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

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
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [filters]);

  const createTask = async (payload: CreateTaskPayload) => {
    try {
      await taskService.create(payload);
      toast.success('Task created successfully');
      fetchTasks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id: string, payload: UpdateTaskPayload) => {
    try {
      await taskService.update(id, payload);
      toast.success('Task updated successfully');
      fetchTasks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.remove(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const bulkDeleteTasks = async (ids: string[]) => {
    try {
      await taskService.bulkRemove(ids);
      toast.success(`${ids.length} tasks deleted`);
      fetchTasks();
    } catch (err: any) {
      toast.error('Failed to delete some tasks');
    }
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
    refreshTasks: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkDeleteTasks,
  };
}
