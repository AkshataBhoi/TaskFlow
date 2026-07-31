import { ArrowUp, Minus, ArrowDown } from 'lucide-react';
import type { Priority } from '../../types/task';
import { cn } from '../../utils/cn';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const config: Record<Priority, { label: string; classes: string; Icon: React.ElementType }> = {
  high:   { label: 'High',   classes: 'bg-red-50 text-red-700',    Icon: ArrowUp   },
  medium: { label: 'Medium', classes: 'bg-amber-50 text-amber-700', Icon: Minus     },
  low:    { label: 'Low',    classes: 'bg-green-50 text-green-700', Icon: ArrowDown },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { label, classes, Icon } = config[priority] ?? config.medium;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', classes, className)}>
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
}