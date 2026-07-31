import { motion } from 'framer-motion';
import {
  Folder, Code, Palette, BookOpen, BarChart, Zap,
  Pencil, Trash2,
} from 'lucide-react';
import type { Category, CategoryColor, CategoryIcon } from '../../types/task';
import { cn } from '../../utils/cn';

// Icon map
const ICONS: Record<CategoryIcon, React.ElementType> = {
  Folder, Code, Palette, BookOpen, BarChart, Zap,
};

// Color map
const COLOR_CLASSES: Record<CategoryColor, { bg: string; iconBg: string; iconColor: string; ring: string; bar: string }> = {
  blue:   { bg: 'bg-blue-50',   iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   ring: 'ring-blue-200',   bar: 'bg-blue-500'   },
  purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', ring: 'ring-purple-200', bar: 'bg-purple-500' },
  green:  { bg: 'bg-emerald-50',iconBg: 'bg-emerald-100',iconColor: 'text-emerald-600',ring: 'ring-emerald-200',bar: 'bg-emerald-500'},
  orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', ring: 'ring-orange-200', bar: 'bg-orange-500' },
  red:    { bg: 'bg-red-50',    iconBg: 'bg-red-100',    iconColor: 'text-red-600',    ring: 'ring-red-200',    bar: 'bg-red-500'    },
  teal:   { bg: 'bg-teal-50',   iconBg: 'bg-teal-100',   iconColor: 'text-teal-600',   ring: 'ring-teal-200',   bar: 'bg-teal-500'   },
};

interface CategoryCardProps {
  category: Category;
  index?: number;
  onEdit:   (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryCard({ category, index = 0, onEdit, onDelete }: CategoryCardProps) {
  const colors   = COLOR_CLASSES[category.color] ?? COLOR_CLASSES.blue;
  const IconComp = ICONS[category.icon] ?? Folder;
  const progress = category.taskCount > 0
    ? Math.round((category.completedCount / category.taskCount) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-30", colors.bg)} />

      {/* Action buttons — hover reveal */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-10">
        <button
          onClick={() => onEdit(category)}
          className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Icon + Name */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm', colors.iconBg)}>
          <IconComp size={20} className={colors.iconColor} />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{category.name}</p>
          <p className="text-xs text-slate-500">{category.taskCount} tasks</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{category.completedCount} completed</span>
          <span className="font-medium text-slate-700">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', colors.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
