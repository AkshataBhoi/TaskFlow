import { CheckCircle2, CircleDashed, ListTodo, Timer } from 'lucide-react';
import { StatsCard } from './StatsCard';
import type { DashboardStats } from '../../types/task';
import { StatsCardSkeleton } from '../ui/LoadingSkeleton';

interface StatsGridProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
      </div>
    );
  }

  const cards = [
    {
      icon: ListTodo,
      title: 'Total Tasks',
      value: stats?.total ?? 0,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 12,
    },
    {
      icon: CircleDashed,
      title: 'Pending',
      value: stats?.pending ?? 0,
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-100',
      trend: -5,
    },
    {
      icon: Timer,
      title: 'High Priority',
      value: stats?.highPriority ?? 0,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: 8,
    },
    {
      icon: CheckCircle2,
      title: 'Completed',
      value: stats?.completed ?? 0,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: 18,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, index) => (
        <StatsCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
}