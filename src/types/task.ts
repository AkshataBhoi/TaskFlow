// ─── Enums / Union Types ────────────────────────────────────────────────────

export type Priority = 'Low' | 'Medium' | 'High';
export type Status   = 'Pending' | 'In Progress' | 'Completed';

// ─── Core Domain Types ───────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Member' | 'Viewer';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  icon: CategoryIcon;
  taskCount: number;
  completedCount: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;        // category id
  categoryName: string;    // denormalized for display
  priority: Priority;
  status: Status;
  dueDate: string;         // ISO date string
  assignedTo?: string;     // user id
  assignedToName?: string; // denormalized for display
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  entityType: 'task' | 'category' | 'auth';
  entityId?: string;
  entityTitle: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
}

// ─── Sub-types ───────────────────────────────────────────────────────────────

export type HistoryEventType = 'created' | 'updated' | 'deleted' | 'completed' | 'login' | 'logout';

export type CategoryColor =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'red'
  | 'teal';

export type CategoryIcon =
  | 'Folder'
  | 'Code'
  | 'Palette'
  | 'BookOpen'
  | 'BarChart'
  | 'Zap';

// ─── API Shape Types (mirrors what Express + MongoDB would return) ────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filter / Query Types ─────────────────────────────────────────────────────

export interface TaskFilters {
  search?: string;
  status?: Status | '';
  category?: string;
  priority?: Priority | '';
  sortBy?: 'title' | 'dueDate' | 'priority' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ─── Form Payload Types ───────────────────────────────────────────────────────

export interface CreateTaskPayload {
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  assignedTo?: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface CreateCategoryPayload {
  name: string;
  color: CategoryColor;
  icon: CategoryIcon;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;