import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, RefreshCw } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { FilterBar } from '../components/dashboard/FilterBar';
import { TaskTable } from '../components/task/TaskTable';
import { TaskModal } from '../components/task/TaskModal';
import { Button } from '../components/ui/Button';
import { useTasks } from '../hooks/useTasks';
import { useDashboard } from '../hooks/useDashboard';
import { useCategories } from '../hooks/useCategories';
import type { Task, CreateTaskPayload, TaskFilters } from '../types/task';
import { useOutletContext } from "react-router-dom";
import { TaskMobileList } from '../components/task/TaskMobileList';

type DashboardContext = {
  openNewTaskModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};


export default function Dashboard() {
  const [filters, setFilters] = useState<TaskFilters>({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isRefresh, setIsRefreshing] = useState(false);


  const {
    onRefresh,
    isRefreshing,
  } = useOutletContext<DashboardContext>();

  // Fetch dashboard stats
  const { stats, loading: statsLoading, refresh: refreshDashboard } = useDashboard();

  // Fetch real categories for the filter dropdown
  const { categories } = useCategories();

  // Fetch filtered tasks (for table preview — limit 6)
  const { tasks: filteredTasks, loading: tableLoading, createTask, updateTask, refreshTasks, deleteTask } = useTasks(filters, 10);
  const {
    refreshCategories,
  } = useCategories();

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

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await Promise.all([
      refreshDashboard(),
      refreshTasks(),
      refreshCategories(),
    ]);

    setIsRefreshing(false);
  };

  return (
    <div className="space-y-7">
      <DashboardHeader />

      {/* Stats */}
      <StatsGrid stats={stats} loading={statsLoading} />

      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
        />

        <div className="grid grid-cols-2 gap-3 w-[90%] lg:w-auto lg:flex lg:items-center">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>

          <Button
            icon={<Plus size={16} />}
            onClick={() => {
              setEditingTask(null);
              setTaskModalOpen(true);
            }}
            className="w-full justify-center"
          >
            New Task
          </Button>
        </div>
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

        <TaskMobileList
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