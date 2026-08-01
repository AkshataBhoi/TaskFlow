import { Select } from '../ui/Select';
import { SearchInput } from '../ui/SearchInput';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import type { TaskFilters, Priority, Status, Category } from '../../types/task';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  categories?: Category[]; // real categories from backend
}

const STATUS_OPTIONS = [
  { value: '',            label: 'All Statuses' },
  { value: 'pending',     label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: '',       label: 'All Priorities' },
  { value: 'high',   label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate',   label: 'Due Date' },
  { value: 'title',     label: 'Name (A–Z)' },
  { value: 'priority',  label: 'Priority' },
  { value: 'status',    label: 'Status' },
];

export function FilterBar({ filters, onChange, categories = [] }: FilterBarProps) {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id || (c as any)._id, label: c.name })),
  ];

  const hasActiveFilters = !!(filters.search || filters.status || filters.category || filters.priority);

  const set = (field: keyof TaskFilters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...filters, [field]: e.target.value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput
        placeholder="Search tasks..."
        value={filters.search ?? ''}
        onChange={set('search')}
        onClear={() => onChange({ ...filters, search: '' })}
        className="w-56 flex-shrink-0"
      />

      <Select
        options={STATUS_OPTIONS}
        value={filters.status ?? ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value as Status | '' })}
        className="w-40"
      />

      <Select
        options={categoryOptions}
        value={filters.category ?? ''}
        onChange={set('category')}
        className="w-44"
      />

      <Select
        options={PRIORITY_OPTIONS}
        value={filters.priority ?? ''}
        onChange={(e) => onChange({ ...filters, priority: e.target.value as Priority | '' })}
        className="w-40"
      />

      <Select
        options={SORT_OPTIONS}
        value={filters.sortBy ?? 'createdAt'}
        onChange={(e) => onChange({ ...filters, sortBy: e.target.value as TaskFilters['sortBy'] })}
        className="w-40"
      />

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          icon={<X size={14} />}
          onClick={() => onChange({ sortBy: 'createdAt', sortOrder: 'desc' })}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
