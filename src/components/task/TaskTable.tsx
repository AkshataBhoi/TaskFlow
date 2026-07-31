import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, ListTodo, Trash2, Plus } from 'lucide-react';
import type { Task } from '../../types/task';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { TaskActionsMenu } from './TaskActionsMenu';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { TableRowSkeleton } from '../ui/LoadingSkeleton';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDate, isOverdue } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

interface TaskTableProps {
  tasks: Task[];
  total?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  loading?: boolean;
  showPagination?: boolean;
  limit?: number;
  onPageChange?: (p: number) => void;
  onEdit?:       (task: Task) => void;
  onDelete?:     (id: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onAddTask?:    () => void;
  sortBy?:       string;
  sortOrder?:    'asc' | 'desc';
  onSort?:       (col: string) => void;
}

type ColKey = 'title' | 'categoryName' | 'priority' | 'dueDate' | 'status';

const COLUMNS: { key: ColKey; label: string; sortable?: boolean; width?: string }[] = [
  { key: 'title',        label: 'Task',     sortable: true,  width: 'w-[35%]'  },
  { key: 'categoryName', label: 'Category', sortable: true,  width: 'w-[14%]'  },
  { key: 'priority',     label: 'Priority', sortable: true,  width: 'w-[12%]'  },
  { key: 'dueDate',      label: 'Due Date', sortable: true,  width: 'w-[14%]'  },
  { key: 'status',       label: 'Status',   sortable: true,  width: 'w-[14%]'  },
];

export function TaskTable({
  tasks,
  total = tasks.length,
  totalPages = 1,
  page = 1,
  pageSize = 10,
  loading = false,
  showPagination = false,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onAddTask,
  sortBy,
  sortOrder = 'asc',
  onSort,
}: TaskTableProps) {
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [deleteBulk, setDeleteBulk]   = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const displayedTasks = limit ? tasks.slice(0, limit) : tasks;

  // Selection helpers
  const allChecked    = displayedTasks.length > 0 && displayedTasks.every((t) => selected.has(t.id));
  const someChecked   = displayedTasks.some((t) => selected.has(t.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(displayedTasks.map((t) => t.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteOne = async () => {
    if (!deleteId || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;
    setDeleting(true);
    try {
      await onBulkDelete(Array.from(selected));
      setSelected(new Set());
    } finally {
      setDeleting(false);
      setDeleteBulk(false);
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortBy !== col) return <span className="w-3.5" />;
    return sortOrder === 'asc'
      ? <ArrowUp size={12} className="text-blue-600" />
      : <ArrowDown size={12} className="text-blue-600" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Bulk action bar */}
      <AnimatePresence>
        {someChecked && onBulkDelete && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-blue-50 border-b border-blue-100"
          >
            <div className="px-6 py-3 flex items-center gap-3">
              <span className="text-sm font-medium text-blue-700">
                {selected.size} task{selected.size > 1 ? 's' : ''} selected
              </span>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={() => setDeleteBulk(true)}
              >
                Delete selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(new Set())}
              >
                Clear selection
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {/* Checkbox col */}
              {onBulkDelete && (
                <th className="w-12 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
              )}

              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-4 select-none',
                    col.width,
                    col.sortable && onSort && 'cursor-pointer hover:text-slate-800 transition-colors'
                  )}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && onSort && <SortIcon col={col.key} />}
                  </span>
                </th>
              ))}

              <th className="w-12 px-4 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <TableRowSkeleton cols={onBulkDelete ? 7 : 6} />
            ) : displayedTasks.length === 0 ? (
              <tr>
                <td colSpan={onBulkDelete ? 7 : 6} className="py-0">
                  <EmptyState
                    icon={<ListTodo size={28} />}
                    title="No tasks found"
                    description="Try adjusting your search or filters, or create a new task."
                    action={
                      onAddTask && (
                        <Button size="sm" icon={<Plus size={14} />} onClick={onAddTask}>
                          Add Task
                        </Button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              displayedTasks.map((task) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-slate-50/70 transition-colors duration-100"
                >
                  {/* Checkbox */}
                  {onBulkDelete && (
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(task.id)}
                        onChange={() => toggleOne(task.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  )}

                  {/* Title */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                    </div>
                  </td>

                  {/* Category chip */}
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      {task.categoryName}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'text-sm',
                        task.status !== 'completed' && isOverdue(task.dueDate)
                          ? 'text-red-600 font-medium'
                          : 'text-slate-600'
                      )}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <TaskActionsMenu
                        taskId={task.id}
                        onEdit={onEdit ? () => onEdit(task) : undefined}
                        onDelete={onDelete ? () => setDeleteId(task.id) : undefined}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && onPageChange && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}

      {/* Delete confirm — single */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteOne}
        loading={deleting}
        title="Delete Task"
        description="This action cannot be undone. The task will be permanently removed."
        confirmLabel="Delete Task"
      />

      {/* Delete confirm — bulk */}
      <ConfirmDialog
        open={deleteBulk}
        onClose={() => setDeleteBulk(false)}
        onConfirm={handleBulkDelete}
        loading={deleting}
        title={`Delete ${selected.size} Tasks`}
        description={`You are about to permanently delete ${selected.size} tasks. This cannot be undone.`}
        confirmLabel={`Delete ${selected.size} Tasks`}
      />
    </div>
  );
}