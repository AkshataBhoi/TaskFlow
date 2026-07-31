import type { Status } from '../../types/task';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const config: Record<Status, { label: string; classes: string; dot: string }> = {
  'pending':     { label: 'Pending',     classes: 'bg-slate-100 text-slate-700',    dot: 'bg-slate-400'   },
  'in-progress': { label: 'In Progress', classes: 'bg-blue-50 text-blue-700',       dot: 'bg-blue-500'    },
  'completed':   { label: 'Completed',   classes: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, classes, dot } = config[status] ?? config['pending'];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', classes, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)} />
      {label}
    </span>
  );
}