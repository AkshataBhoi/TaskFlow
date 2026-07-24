import { CheckCircle2, CircleDashed, ListTodo, Timer } from 'lucide-react';
import { StatsCard } from './StatsCard';
import type { Task } from '../../types/task';
import { StatsCardSkeleton } from '../ui/LoadingSkeleton';

interface StatsGridProps {
  tasks: Task[];
  loading?: boolean;
}

export function StatsGrid({ tasks, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
      </div>
    );
  }

  const total      = tasks.length;
  const pending    = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed  = tasks.filter((t) => t.status === 'Completed').length;

  const stats = [
    { icon: ListTodo,     title: 'Total Tasks',  value: total,      iconColor: 'text-blue-600',    bgColor: 'bg-blue-50',    trend: 12  },
    { icon: CircleDashed, title: 'Pending',       value: pending,    iconColor: 'text-slate-600',   bgColor: 'bg-slate-100',  trend: -5  },
    { icon: Timer,        title: 'In Progress',   value: inProgress, iconColor: 'text-amber-600',   bgColor: 'bg-amber-50',   trend: 8   },
    { icon: CheckCircle2, title: 'Completed',     value: completed,  iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', trend: 18  },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item, i) => (
        <StatsCard key={item.title} {...item} index={i} />
      ))}
    </div>
  );
}