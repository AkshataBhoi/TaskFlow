import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { FilterBar } from '../components/dashboard/FilterBar';
import { TaskTable } from '../components/task/TaskTable';
import { TaskModal } from '../components/task/TaskModal';
import { Button } from '../components/ui/Button';
import { useTasks } from '../hooks/useTasks';
import { useDashboard } from '../hooks/useDashboard';
import type { Task, CreateTaskPayload, TaskFilters } from '../types/task';

export default function Dashboard() {
  const [filters, setFilters] = useState<TaskFilters>({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask]     = useState<Task | null>(null);

  // Fetch dashboard stats
  const { stats, loading: statsLoading, refresh: refreshDashboard } = useDashboard();

  // Fetch filtered tasks (for table preview — limit 6)
  const { tasks: filteredTasks, loading: tableLoading, createTask, updateTask, deleteTask } = useTasks(filters, 10);

  const handleSave = async (payload: CreateTaskPayload) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }
    setEditingTask(null);
    setTaskModalOpen(false);
    refreshDashboard();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    refreshDashboard();
  };

  return (
    <div className="space-y-7">
      <DashboardHeader />

      {/* Stats */}
      <StatsGrid stats={stats} loading={statsLoading} />

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterBar filters={filters} onChange={setFilters} />
        <Button
          icon={<Plus size={16} />}
          onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
          className="shrink-0"
        >
          New Task
        </Button>
      </div>

      {/* Recent tasks table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Tasks</h3>
            <p className="text-sm text-slate-500 mt-0.5">Your latest tasks based on filters</p>
          </div>
          <Link
            to="/my-tasks"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all tasks <ArrowRight size={15} />
          </Link>
        </div>

        <TaskTable
          tasks={filteredTasks}
          loading={tableLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddTask={() => setTaskModalOpen(true)}
          limit={6}
        />
      </div>

      <TaskModal
        open={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}