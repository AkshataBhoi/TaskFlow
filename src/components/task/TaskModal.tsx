import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import type { Task, CreateTaskPayload, Priority, Status } from '../../types/task';
import { MOCK_CATEGORIES } from '../../data/mockData';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateTaskPayload) => Promise<void> | void;
  task?: Task | null; // if provided → edit mode
}

const PRIORITY_OPTIONS = [
  { value: 'Low',    label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High',   label: 'High' },
];

const STATUS_OPTIONS = [
  { value: 'Pending',     label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed',   label: 'Completed' },
];

interface FormState {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  assignedTo: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  dueDate?: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  category: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
  assignedTo: '',
};

export function TaskModal({ open, onClose, onSave, task }: TaskModalProps) {
  const [form, setForm]     = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const isEdit = !!task;

  // Seed form when task changes
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title,
        description: task.description ?? '',
        category:    task.category,
        priority:    task.priority,
        status:      task.status,
        dueDate:     task.dueDate,
        assignedTo:  task.assignedTo ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [task, open]);

  const categoryOptions = MOCK_CATEGORIES.map((c) => ({ value: c.id, label: c.name }));

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim())    newErrors.title    = 'Task title is required';
    if (!form.category)        newErrors.category = 'Please select a category';
    if (!form.dueDate)         newErrors.dueDate  = 'Please select a due date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: CreateTaskPayload = {
        title:       form.title.trim(),
        description: form.description.trim() || undefined,
        category:    form.category,
        priority:    form.priority as Priority,
        status:      form.status as Status,
        dueDate:     form.dueDate,
        assignedTo:  form.assignedTo || undefined,
      };
      await onSave(payload);
      onClose();
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
          <Select
            label="Category"
            required
            placeholder="Select category"
            options={categoryOptions}
            value={form.category}
            onChange={set('category')}
            error={errors.category}
          />
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
