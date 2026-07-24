import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'teal' | 'orange';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-slate-100 text-slate-700',
  primary:  'bg-blue-50 text-blue-700',
  success:  'bg-emerald-50 text-emerald-700',
  warning:  'bg-amber-50 text-amber-700',
  danger:   'bg-red-50 text-red-700',
  purple:   'bg-purple-50 text-purple-700',
  teal:     'bg-teal-50 text-teal-700',
  orange:   'bg-orange-50 text-orange-700',
};

const dotClasses: Record<BadgeVariant, string> = {
  default:  'bg-slate-500',
  primary:  'bg-blue-600',
  success:  'bg-emerald-500',
  warning:  'bg-amber-500',
  danger:   'bg-red-500',
  purple:   'bg-purple-500',
  teal:     'bg-teal-500',
  orange:   'bg-orange-500',
};

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClasses[variant])} />}
      {children}
    </span>
  );
}
