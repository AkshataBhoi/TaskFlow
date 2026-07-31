import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import type { Task, CreateTaskPayload, Priority, Status, Category } from '../../types/task';
import { categoryService } from '../../services/categoryService';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateTaskPayload) => Promise<void> | void;
  task?: Task | null; // if provided → edit mode
}

const PRIORITY_OPTIONS = [
  { value: 'low',        label: 'Low' },
  { value: 'medium',     label: 'Medium' },
  { value: 'high',       label: 'High' },
];

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
];

interface FormState {
  title: string;
  description: string;
  categoryInput: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  assignedTo: string;
}

interface FormErrors {
  title?: string;
  categoryInput?: string;
  dueDate?: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  categoryInput: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
  assignedTo: '',
};

export function TaskModal({ open, onClose, onSave, task }: TaskModalProps) {
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [saving, setSaving]       = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const isEdit = !!task;

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAll();
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Seed form when task changes
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title,
        description: task.description ?? '',
        categoryInput: categories.find((c) => c.id === task.categoryId || (c as any)._id === task.categoryId)?.name || '',
        priority:    task.priority,
        status:      task.status,
        dueDate:     task.dueDate ? task.dueDate.slice(0, 10) : '',
        assignedTo:  task.assignedTo ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [task, open, categories]);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim())    newErrors.title      = 'Task title is required';
    if (!form.categoryInput.trim()) newErrors.categoryInput = 'Please select or create a category';
    if (!form.dueDate)         newErrors.dueDate    = 'Please select a due date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      let finalCategoryId = '';
      const existingCategory = categories.find(
        (c) => c.name.toLowerCase() === form.categoryInput.trim().toLowerCase()
      );

      if (existingCategory) {
        finalCategoryId = existingCategory.id || (existingCategory as any)._id;
      } else {
        // Create new category on the fly
        const res = await categoryService.create({
          name: form.categoryInput.trim(),
          color: 'blue',
          icon: 'Folder',
        });
        finalCategoryId = res.data.id || (res.data as any)._id;
        
        // Refresh categories list silently
        categoryService.getAll().then((r) => setCategories(r.data)).catch(console.error);
      }

      const payload: CreateTaskPayload = {
        title:       form.title.trim(),
        description: form.description.trim() || undefined,
        categoryId:  finalCategoryId,
        priority:    form.priority as Priority,
        status:      form.status as Status,
        dueDate:     form.dueDate,
        assignedTo:  form.assignedTo || undefined,
      };
      
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('TaskModal: onSave error', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
      description={isEdit ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Title */}
        <Input
          label="Task Title"
          required
          placeholder="e.g. Design the onboarding flow"
          value={form.title}
          onChange={set('title')}
          error={errors.title}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Add more context or steps..."
          value={form.description}
          onChange={set('description')}
          rows={3}
        />

        {/* Row: Category + Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              list="categories-list"
              className={`w-full px-3 py-2.5 bg-white border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                errors.categoryInput ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'
              }`}
              placeholder="Select or type to create..."
              value={form.categoryInput}
              onChange={set('categoryInput')}
            />
            <datalist id="categories-list">
              {categories.map((c) => (
                <option key={c.id || (c as any)._id} value={c.name} />
              ))}
            </datalist>
            {errors.categoryInput && <p className="text-xs text-red-500 mt-1">{errors.categoryInput}</p>}
          </div>
          <Select
            label="Priority"
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={set('priority')}
          />
        </div>

        {/* Row: Status + Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={set('status')}
          />
          <Input
            label="Due Date"
            required
            type="date"
            value={form.dueDate}
            onChange={set('dueDate')}
            error={errors.dueDate}
          />
        </div>

        {/* Assigned To */}
        <Input
          label="Assigned To"
          placeholder="e.g. John Doe (optional)"
          value={form.assignedTo}
          onChange={set('assignedTo')}
        />
      </div>
    </Modal>
  );
}
