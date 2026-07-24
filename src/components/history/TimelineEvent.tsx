import { motion } from 'framer-motion';
import {
  Plus, Pencil, Trash2, CheckCircle2, LogIn, LogOut, Folder,
} from 'lucide-react';
import type { HistoryEvent, HistoryEventType } from '../../types/task';
import { formatRelativeTime } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

const EVENT_CONFIG: Record<HistoryEventType, {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  label: string;
}> = {
  created:   { icon: Plus,          bgColor: 'bg-blue-50',    iconColor: 'text-blue-600',    label: 'Created'   },
  updated:   { icon: Pencil,        bgColor: 'bg-amber-50',   iconColor: 'text-amber-600',   label: 'Updated'   },
  deleted:   { icon: Trash2,        bgColor: 'bg-red-50',     iconColor: 'text-red-600',     label: 'Deleted'   },
  completed: { icon: CheckCircle2,  bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', label: 'Completed' },
  login:     { icon: LogIn,         bgColor: 'bg-purple-50',  iconColor: 'text-purple-600',  label: 'Login'     },
  logout:    { icon: LogOut,        bgColor: 'bg-slate-100',  iconColor: 'text-slate-600',   label: 'Logout'    },
};

interface TimelineEventProps {
  event: HistoryEvent;
  index: number;
  isLast: boolean;
}

export function TimelineEvent({ event, index, isLast }: TimelineEventProps) {
  const cfg  = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.updated;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative pl-10"
    >
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[13px] top-8 bottom-0 w-px bg-slate-100" />
      )}

      {/* Icon bubble */}
      <div className={cn(
        'absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white ring-2',
        cfg.bgColor,
        'ring-slate-100'
      )}>
        <Icon size={13} className={cfg.iconColor} />
      </div>

      {/* Content */}
      <div className="pb-7 group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 leading-snug">{event.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                {event.userName.charAt(0)}
              </div>
              <span className="text-xs text-slate-500">{event.userName}</span>
            </div>
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
            {formatRelativeTime(event.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
