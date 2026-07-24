import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  trend?: number;       // % change (positive = up, negative = down)
  trendLabel?: string;  // e.g. "vs last week"
  index?: number;
}

export function StatsCard({ title, value, icon: Icon, iconColor, bgColor, trend, trendLabel = 'vs last week', index = 0 }: StatsCardProps) {
  const trendPositive = (trend ?? 0) > 0;
  const trendNeutral  = trend === 0 || trend === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <motion.h2
            className="mt-2 text-3xl font-bold text-slate-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.07 + 0.2 }}
          >
            {value}
          </motion.h2>

          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trendNeutral ? (
                <Minus size={13} className="text-slate-400" />
              ) : trendPositive ? (
                <TrendingUp size={13} className="text-emerald-500" />
              ) : (
                <TrendingDown size={13} className="text-red-500" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trendNeutral ? 'text-slate-400' : trendPositive ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {trendNeutral ? 'No change' : `${trendPositive ? '+' : ''}${trend}% ${trendLabel}`}
              </span>
            </div>
          )}
        </div>

        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110', bgColor)}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </motion.div>
  );
}