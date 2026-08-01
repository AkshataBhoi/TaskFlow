import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Tags, FolderOpen, CheckCircle2, LayoutGrid } from 'lucide-react';
import { CategoryCard } from '../components/category/CategoryCard';
import { CategoryModal } from '../components/category/CategoryModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { Button } from '../components/ui/Button';
import { useCategories } from '../hooks/useCategories';
import type { Category, CreateCategoryPayload } from '../types/task';

export default function Categories() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();

  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [deleting, setDeleting]     = useState(false);

  const handleSave = async (payload: CreateCategoryPayload) => {
    if (editTarget) {
      await updateCategory(editTarget.id, payload);
    } else {
      await createCategory(payload);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteId);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Summary stats from real data
  const totalTasks     = categories.reduce((s, c) => s + (c.taskCount      ?? 0), 0);
  const totalCompleted = categories.reduce((s, c) => s + (c.completedCount ?? 0), 0);
  const overallProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Page banner header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border border-purple-100 shadow-sm px-7 py-6">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-100 rounded-full opacity-40 pointer-events-none" />
        <div className="absolute -bottom-8 left-16 w-32 h-32 bg-indigo-100 rounded-full opacity-30 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-200 shrink-0">
              <LayoutGrid size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">Categories</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} · {totalTasks} total tasks
              </p>
            </div>
          </div>

          {/* Right — summary badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl text-sm font-medium text-purple-700 shadow-sm">
              <FolderOpen size={15} />
              {categories.length} categories
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 shadow-sm">
              <CheckCircle2 size={15} />
              {overallProgress}% done
            </div>
            <Button
              icon={<Plus size={16} />}
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-md shadow-purple-200"
            >
              New Category
            </Button>
          </div>
        </div>

        {/* Overall progress bar */}
        {totalTasks > 0 && (
          <div className="relative mt-5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Overall completion</span>
              <span className="font-semibold text-slate-700">{totalCompleted} / {totalTasks} tasks done</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-purple-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tags size={28} />}
          title="No categories yet"
          description="Create your first category to start organizing your tasks by project or theme."
          action={
            <Button icon={<Plus size={14} />} size="sm" onClick={() => setModalOpen(true)}>
              Create Category
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={i}
              onEdit={(c) => { setEditTarget(c); setModalOpen(true); }}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <CategoryModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        category={editTarget}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Category"
        description="This will permanently delete the category. Tasks assigned to it will remain but become uncategorized."
        confirmLabel="Delete Category"
      />
    </div>
  );
}
