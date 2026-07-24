import { useState, useRef } from 'react';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';

interface TaskActionsMenuProps {
  taskId: string;
  onView?:   (id: string) => void;
  onEdit?:   (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskActionsMenu({ taskId, onView, onEdit, onDelete }: TaskActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <MoreHorizontal size={17} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.13 }}
            className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-20"
          >
            {onView && (
              <MenuItem
                icon={<Eye size={14} />}
                onClick={() => { onView(taskId); setOpen(false); }}
              >
                View Details
              </MenuItem>
            )}
            {onEdit && (
              <MenuItem
                icon={<Pencil size={14} />}
                onClick={() => { onEdit(taskId); setOpen(false); }}
              >
                Edit Task
              </MenuItem>
            )}
            {onDelete && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <MenuItem
                  icon={<Trash2 size={14} />}
                  onClick={() => { onDelete(taskId); setOpen(false); }}
                  danger
                >
                  Delete
                </MenuItem>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-700 hover:bg-slate-50'
      )}
    >
      {icon}
      {children}
    </button>
  );
}
