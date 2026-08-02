import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TaskTable } from '../components/task/TaskTable';
import { TaskMobileList } from '../components/task/TaskMobileList';
import { TaskModal } from '../components/task/TaskModal';
import { FilterBar } from '../components/dashboard/FilterBar';
import { Button } from '../components/ui/Button';
import { useTasks } from '../hooks/useTasks';
import { useCategories } from '../hooks/useCategories';
import type { Task, CreateTaskPayload, TaskFilters } from '../types/task';

export default function Tasks() {
  const [filters, setFilters]           = useState<TaskFilters>({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask]   = useState<Task | null>(null);

  const {
    tasks, total, totalPages, page, setPage,
    loading, createTask, updateTask, deleteTask, bulkDeleteTasks,
    setFilters: applyFilters,
  } = useTasks(filters, 8);

  const { categories } = useCategories();

  const handleFilterChange = (f: TaskFilters) => {
    setFilters(f);
    applyFilters(f);
  };

  const handleSave = async (payload: CreateTaskPayload) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleSort = (col: string) => {
    setFilters((f) => ({
      ...f,
      sortBy:    col as TaskFilters['sortBy'],
      sortOrder: f.sortBy === col && f.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="space-y-6 relative">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">
            {total} task{total !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar filters={filters} onChange={handleFilterChange} categories={categories} />

      {/* ── Desktop table (md and above) ────────────────────────── */}
      <div className="hidden md:block">
        <TaskTable
          tasks={tasks}
          total={total}
          totalPages={totalPages}
          page={page}
          pageSize={8}
          loading={loading}
          showPagination
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onBulkDelete={bulkDeleteTasks}
          onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
        />
      </div>

      {/* ── Mobile card list (below md) ──────────────────────────── */}
      <div className="md:hidden">
        <TaskMobileList
          tasks={tasks}
          total={total}
          totalPages={totalPages}
          page={page}
          pageSize={8}
          loading={loading}
          showPagination
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onBulkDelete={bulkDeleteTasks}
          onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }}
        />
      </div>

      {/* Floating Add Task FAB */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-8 right-8 z-30"
      >
        <Button
          onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
          icon={<Plus size={20} />}
          size="lg"
          className="rounded-2xl shadow-lg hover:shadow-xl !px-5 !py-3.5"
        >
          Add Task
        </Button>
      </motion.div>

      <TaskModal
        open={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
