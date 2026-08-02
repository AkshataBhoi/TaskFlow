import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ListTodo, Plus, Trash2, Pencil } from 'lucide-react';
import type { Task } from '../../types/task';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDate, isOverdue } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

interface TaskMobileListProps {
  tasks: Task[];
  total?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  loading?: boolean;
  showPagination?: boolean;
  limit?: number;
  onPageChange?: (p: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onAddTask?: () => void;
}

/** Single skeleton card shown while data loads */
function MobileCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

const cardVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y:       0,
    transition: { delay: i * 0.055, duration: 0.28, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

export function TaskMobileList({
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
}: TaskMobileListProps) {
  const [selected,   setSelected]   = useState<Set<string>>(new Set());
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [deleteBulk, setDeleteBulk] = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const displayedTasks = limit ? tasks.slice(0, limit) : tasks;

  const someChecked = displayedTasks.some((t) => selected.has(t.id));

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
    try   { await onDelete(deleteId); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;
    setDeleting(true);
    try   { await onBulkDelete(Array.from(selected)); setSelected(new Set()); }
    finally { setDeleting(false); setDeleteBulk(false); }
  };

  return (
    <div className="space-y-3">

      {/* ── Bulk-action bar ──────────────────────────────────────── */}
      <AnimatePresence>
        {someChecked && onBulkDelete && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
              <span className="text-sm font-medium text-blue-700 flex-1">
                {selected.size} task{selected.size > 1 ? 's' : ''} selected
              </span>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={13} />}
                onClick={() => setDeleteBulk(true)}
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card list ────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <MobileCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedTasks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <EmptyState
            icon={<ListTodo size={26} />}
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
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {displayedTasks.map((task, i) => {
            const overdue    = task.status !== 'completed' && isOverdue(task.dueDate);
            const isSelected = selected.has(task.id);

            return (
              <motion.div
                key={task.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className={cn(
                  'group relative bg-white border rounded-2xl shadow-sm overflow-hidden',
                  'transition-shadow duration-200 hover:shadow-md hover:border-blue-200',
                  isSelected
                    ? 'border-blue-400 ring-2 ring-blue-100'
                    : 'border-slate-200'
                )}
              >
                {/* Priority accent stripe on the left edge */}
                <div
                  className={cn(
                    'absolute left-0 top-0 bottom-0 w-[3px]',
                    task.priority === 'high'
                      ? 'bg-red-400'
                      : task.priority === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-green-400'
                  )}
                />

                <div className="pl-4 pr-3 pt-3.5 pb-3.5">

                  {/* Row 1 – checkbox (opt) + title + description + actions */}
                  <div className="flex items-start gap-2.5">
                    {onBulkDelete && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(task.id)}
                        className="mt-0.5 w-4 h-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-semibold text-slate-900 leading-snug truncate',
                          'group-hover:text-blue-600 transition-colors duration-150'
                        )}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 -mt-1 flex items-center gap-0.5">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(task)}
                          title="Edit task"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setDeleteId(task.id)}
                          title="Delete task"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 2 – category + priority + status badges */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {task.categoryName}
                    </span>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge   status={task.status}   />
                  </div>

                  {/* Row 3 – due date with calendar icon */}
                  <div
                    className={cn(
                      'mt-2 flex items-center gap-1.5 text-xs',
                      overdue ? 'text-red-500 font-medium' : 'text-slate-400'
                    )}
                  >
                    <CalendarDays size={12} className="shrink-0" />
                    <span>
                      {overdue ? 'Overdue · ' : ''}
                      {formatDate(task.dueDate)}
                    </span>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* ── Pagination ───────────────────────────────────────────── */}
      {showPagination && onPageChange && totalPages > 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* ── Confirm dialogs ──────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteOne}
        loading={deleting}
        title="Delete Task"
        description="This action cannot be undone. The task will be permanently removed."
        confirmLabel="Delete Task"
      />
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
