import { motion } from 'framer-motion';
import {
  Folder, Code, Palette, BookOpen, BarChart, Zap,
  Pencil, Trash2, CheckCircle2, ListTodo,
} from 'lucide-react';
import type { Category, CategoryColor, CategoryIcon } from '../../types/task';
import { cn } from '../../utils/cn';

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICONS: Record<CategoryIcon, React.ElementType> = {
  Folder, Code, Palette, BookOpen, BarChart, Zap,
};

// ─── Color map — richer with gradient support ─────────────────────────────────
const COLOR_MAP: Record<
  CategoryColor,
  { gradient: string; iconBg: string; iconColor: string; bar: string; badge: string; glow: string }
> = {
  blue: {
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    bar: 'bg-gradient-to-r from-blue-400 to-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    glow: 'shadow-blue-100',
  },
  purple: {
    gradient: 'from-purple-500/10 to-purple-600/5',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    bar: 'bg-gradient-to-r from-purple-400 to-purple-600',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    glow: 'shadow-purple-100',
  },
  green: {
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    glow: 'shadow-emerald-100',
  },
  orange: {
    gradient: 'from-orange-500/10 to-orange-600/5',
    iconBg: 'bg-orange-500',
    iconColor: 'text-white',
    bar: 'bg-gradient-to-r from-orange-400 to-orange-600',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    glow: 'shadow-orange-100',
  },
  red: {
    gradient: 'from-red-500/10 to-red-600/5',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    bar: 'bg-gradient-to-r from-red-400 to-red-600',
    badge: 'bg-red-50 text-red-700 border-red-200',
    glow: 'shadow-red-100',
  },
  teal: {
    gradient: 'from-teal-500/10 to-teal-600/5',
    iconBg: 'bg-teal-500',
    iconColor: 'text-white',
    bar: 'bg-gradient-to-r from-teal-400 to-teal-600',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    glow: 'shadow-teal-100',
  },
};

interface CategoryCardProps {
  category: Category;
  index?: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryCard({ category, index = 0, onEdit, onDelete }: CategoryCardProps) {
  const colors = COLOR_MAP[category.color] ?? COLOR_MAP.blue;
  const IconComp = ICONS[category.icon] ?? Folder;

  const taskCount = category.taskCount ?? 0;
  const completedCount = category.completedCount ?? 0;
  const pendingCount = Math.max(0, taskCount - completedCount);
  const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-default',
        colors.glow
      )}
    >
      {/* Subtle color wash background */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none', colors.gradient)} />

      {/* Action buttons — hover reveal */}
      {/* <div className="absolute top-3.5 right-3.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"> */}
      <div className="absolute top-3.5 right-3.5 flex gap-1 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Edit clicked");
            onEdit(category);
          }}
          className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-slate-100 shadow-sm"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Delete clicked");
            onDelete(category.id);
          }}
          className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-100 shadow-sm"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Icon + Name row */}
      <div className="flex items-center gap-3.5 mb-4 relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md', colors.iconBg)}
        >
          <IconComp size={20} className={colors.iconColor} />
        </motion.div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate leading-tight">{category.name}</p>
          <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border mt-0.5', colors.badge)}>
            <ListTodo size={9} />
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>{completedCount} done</span>
        </div>
        <div className="w-px h-3 bg-slate-200" />
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <ListTodo size={12} className="text-amber-500" />
          <span>{pendingCount} left</span>
        </div>
        <div className="ml-auto text-xs font-bold text-slate-700">{progress}%</div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10">
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', colors.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: index * 0.07 + 0.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
