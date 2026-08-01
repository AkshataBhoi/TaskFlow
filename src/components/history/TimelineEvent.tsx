import { motion } from 'framer-motion';
import {
  Plus, Pencil, Trash2, CheckCircle2, LogIn, LogOut, Activity,
} from 'lucide-react';
import type { HistoryEvent, HistoryEventType } from '../../types/task';
import { formatRelativeTime } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

const EVENT_CONFIG: Record<HistoryEventType, {
  icon: React.ElementType;
  bgColor: string;
  badgeBg: string;
  iconColor: string;
  label: string;
}> = {
  created:   { icon: Plus,          bgColor: 'bg-blue-50/90 border-blue-200/80',     badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/70',     iconColor: 'text-blue-600',    label: 'Created'   },
  updated:   { icon: Pencil,        bgColor: 'bg-amber-50/90 border-amber-200/80',   badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/70',   iconColor: 'text-amber-600',   label: 'Updated'   },
  deleted:   { icon: Trash2,        bgColor: 'bg-red-50/90 border-red-200/80',       badgeBg: 'bg-red-50 text-red-700 border-red-200/70',       iconColor: 'text-red-600',     label: 'Deleted'   },
  completed: { icon: CheckCircle2,  bgColor: 'bg-emerald-50/90 border-emerald-200/80', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/70', iconColor: 'text-emerald-600', label: 'Completed' },
  login:     { icon: LogIn,         bgColor: 'bg-purple-50/90 border-purple-200/80',  badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/70',  iconColor: 'text-purple-600',  label: 'Login'     },
  logout:    { icon: LogOut,        bgColor: 'bg-slate-100 border-slate-200/80',     badgeBg: 'bg-slate-100 text-slate-700 border-slate-200/70',     iconColor: 'text-slate-600',   label: 'Logout'    },
};

interface TimelineEventProps {
  event: HistoryEvent;
  index: number;
  isLast?: boolean;
}

export function TimelineEvent({ event, index }: TimelineEventProps) {
  const cfg  = EVENT_CONFIG[event.type] ?? {
    icon: Activity,
    bgColor: 'bg-slate-50 border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    iconColor: 'text-slate-600',
    label: 'Event',
  };
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.25) }}
      className="group flex items-center justify-between gap-3 py-2 px-3 rounded-xl hover:bg-slate-50 transition-all duration-150 border border-transparent hover:border-slate-200/80"
    >
      {/* Left side: Icon pill, Label Badge & Description */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Compact Icon pill */}
        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-150 group-hover:scale-105 shadow-2xs',
          cfg.bgColor
        )}>
          <Icon size={14} className={cfg.iconColor} />
        </div>

        {/* Action Label Badge */}
        <span className={cn(
          'hidden xs:inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 uppercase tracking-wider',
          cfg.badgeBg
        )}>
          {cfg.label}
        </span>

        {/* Truncated description */}
        <p className="text-xs sm:text-sm font-medium text-slate-800 truncate min-w-0 leading-tight">
          {event.description}
        </p>
      </div>

      {/* Right side: User badge and Compact timestamp */}
      <div className="flex items-center gap-2.5 shrink-0 text-xs">
        {/* User initials badge */}
        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-md text-[11px]">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white font-bold text-[8px] flex items-center justify-center shrink-0">
            {(event.userName || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline font-medium text-slate-700 truncate max-w-[85px]">{event.userName || 'User'}</span>
        </div>

        {/* Compact Timestamp */}
        <div className="text-right text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors w-16 sm:w-20 shrink-0">
          {formatRelativeTime(event.timestamp)}
        </div>
      </div>
    </motion.div>
  );
}
