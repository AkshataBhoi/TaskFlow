import { useState } from 'react';
import { Plus, Tags } from 'lucide-react';
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

  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState<Category | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [deleting, setDeleting]       = useState(false);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} in your workspace
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="shadow-sm rounded-xl px-5"
        >
          New Category
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tags size={36} className="text-blue-500" />}
          title="No categories yet"
          description="Create your first category to start organizing your tasks efficiently."
          action={
            <Button icon={<Plus size={16} />} size="md" onClick={() => setModalOpen(true)} className="mt-2 rounded-xl">
              Create Category
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Modals */}
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
