import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Category, CategoryColor, CategoryIcon, CreateCategoryPayload } from '../../types/task';
import { cn } from '../../utils/cn';
import { Folder, Code, Palette, BookOpen, BarChart, Zap } from 'lucide-react';

const COLORS: { value: CategoryColor; class: string; label: string }[] = [
  { value: 'blue',   class: 'bg-blue-500',   label: 'Blue'   },
  { value: 'purple', class: 'bg-purple-500', label: 'Purple' },
  { value: 'green',  class: 'bg-emerald-500',label: 'Green'  },
  { value: 'orange', class: 'bg-orange-500', label: 'Orange' },
  { value: 'red',    class: 'bg-red-500',    label: 'Red'    },
  { value: 'teal',   class: 'bg-teal-500',   label: 'Teal'   },
];

const ICONS: { value: CategoryIcon; Icon: React.ElementType }[] = [
  { value: 'Folder',   Icon: Folder   },
  { value: 'Code',     Icon: Code     },
  { value: 'Palette',  Icon: Palette  },
  { value: 'BookOpen', Icon: BookOpen },
  { value: 'BarChart', Icon: BarChart },
  { value: 'Zap',      Icon: Zap      },
];

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateCategoryPayload) => Promise<void>;
  category?: Category | null;
}

interface FormState {
  name:  string;
  color: CategoryColor;
  icon:  CategoryIcon;
}

const EMPTY: FormState = { name: '', color: 'blue', icon: 'Folder' };

export function CategoryModal({ open, onClose, onSave, category }: CategoryModalProps) {
  const [form, setForm]       = useState<FormState>(EMPTY);
  const [nameError, setNameError] = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (category) {
      setForm({ name: category.name, color: category.color, icon: category.icon });
    } else {
      setForm(EMPTY);
    }
    setNameError('');
  }, [category, open]);

  const handleSave = async () => {
    if (!form.name.trim()) { setNameError('Category name is required'); return; }
    setSaving(true);
    try {
      await onSave({ name: form.name.trim(), color: form.color, icon: form.icon });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create Category'}
      description="Give your category a name, color, and icon."
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>
            {category ? 'Save Changes' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Input
          label="Category Name"
          required
          placeholder="e.g. Marketing"
          value={form.name}
          onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setNameError(''); }}
          error={nameError}
        />

        {/* Color picker */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2.5">Color</p>
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map(({ value, class: cls, label }) => (
              <button
                key={value}
                title={label}
                onClick={() => setForm((f) => ({ ...f, color: value }))}
                className={cn(
                  'w-8 h-8 rounded-full transition-all duration-150',
                  cls,
                  form.color === value
                    ? 'ring-2 ring-offset-2 ring-slate-800 scale-110'
                    : 'hover:scale-105'
                )}
              />
            ))}
          </div>
        </div>

        {/* Icon picker */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2.5">Icon</p>
          <div className="flex gap-2 flex-wrap">
            {ICONS.map(({ value, Icon }) => (
              <button
                key={value}
                onClick={() => setForm((f) => ({ ...f, icon: value }))}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 border',
                  form.icon === value
                    ? 'bg-blue-50 border-blue-300 text-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                )}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
