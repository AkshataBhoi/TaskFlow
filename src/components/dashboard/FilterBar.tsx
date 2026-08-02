import { Search, X, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../../hooks/useClickOutside';
import type { TaskFilters, Priority, Status, Category } from '../../types/task';
import { cn } from '../../utils/cn';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  categories?: Category[];
}

const STATUS_OPTIONS: { value: Status | ''; label: string; dot?: string }[] = [
  { value: '',            label: 'All Statuses' },
  { value: 'pending',     label: 'Pending',     dot: 'bg-slate-400'   },
  { value: 'in-progress', label: 'In Progress', dot: 'bg-blue-500'    },
  { value: 'completed',   label: 'Completed',   dot: 'bg-emerald-500' },
];

const PRIORITY_OPTIONS: { value: Priority | ''; label: string; color?: string }[] = [
  { value: '',       label: 'All Priorities' },
  { value: 'high',   label: 'High',   color: 'text-red-600'    },
  { value: 'medium', label: 'Medium', color: 'text-amber-600'  },
  { value: 'low',    label: 'Low',    color: 'text-emerald-600'},
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate',   label: 'Due Date' },
  { value: 'title',     label: 'Name (A–Z)' },
  { value: 'priority',  label: 'Priority' },
  { value: 'status',    label: 'Status' },
];

// ─── Pill dropdown ───────────────────────────────────────────────────────────
function PillDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; dot?: string; color?: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const selected = options.find((o) => o.value === value);
  const isActive = value !== '';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap',
          isActive
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        )}
      >
        {selected?.dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', isActive ? 'bg-white' : selected.dot)} />}
        {selected?.label || label}
        <ChevronDown size={13} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-2 z-50 min-w-[160px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden py-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left',
                  opt.value === value
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {opt.dot && <span className={cn('w-2 h-2 rounded-full shrink-0', opt.dot)} />}
                <span className={opt.color}>{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main FilterBar ───────────────────────────────────────────────────────────
export function FilterBar({ filters, onChange, categories = [] }: FilterBarProps) {
  const categoryOptions: { value: string; label: string }[] = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id || (c as any)._id, label: c.name })),
  ];

  const hasActiveFilters = !!(filters.search || filters.status || filters.category || filters.priority);
  const activeCount = [filters.search, filters.status, filters.category, filters.priority].filter(Boolean).length;

  const clearAll = () => onChange({ sortBy: filters.sortBy || 'createdAt', sortOrder: filters.sortOrder || 'desc' });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search pill */}
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          // className="pl-8 pr-8 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-48"
        className="w-full sm:w-64 lg:w-48 pl-8 pr-8 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status */}
      <PillDropdown<Status | ''>
        label="Status"
        value={filters.status ?? ''}
        options={STATUS_OPTIONS}
        onChange={(v) => onChange({ ...filters, status: v })}
      />

      {/* Category */}
      <PillDropdown<string>
        label="Category"
        value={filters.category ?? ''}
        options={categoryOptions}
        onChange={(v) => onChange({ ...filters, category: v })}
      />

      {/* Priority */}
      <PillDropdown<Priority | ''>
        label="Priority"
        value={filters.priority ?? ''}
        options={PRIORITY_OPTIONS}
        onChange={(v) => onChange({ ...filters, priority: v })}
      />

      {/* Sort */}
      <PillDropdown<string>
        label="Sort by"
        value={filters.sortBy ?? 'createdAt'}
        options={SORT_OPTIONS}
        onChange={(v) => onChange({ ...filters, sortBy: v as TaskFilters['sortBy'] })}
      />

      {/* Clear all badge */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <X size={13} />
            Clear {activeCount > 1 ? `(${activeCount})` : ''}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
