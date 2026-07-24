import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, ...rest }, ref) => {
    const hasValue = !!rest.value;

    return (
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          ref={ref}
          type="text"
          className={cn(
            'w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200',
            'bg-white text-slate-900 placeholder:text-slate-400',
            'outline-none transition-all duration-200',
            'hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
            className
          )}
          {...rest}
        />
        {hasValue && onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
