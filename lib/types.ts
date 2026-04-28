export type Role = "admin" | "manager" | "employee";

export type Priority = "high" | "medium" | "low";

export type TaskStatus = "todo" | "in_progress" | "completed";

export type LeaveStatus = "pending" | "approved" | "rejected";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "half_day"
  | "late"
  | "on_time";

export interface Department {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  profilePhotoUrl?: string;
  designation?: string;
  departmentId?: string;
  role: Role;
  isActive: boolean;
  salary?: number;
}

export interface Team {
  id: string;
  name: string;
  departmentId?: string;
  managerId: string;
  memberIds: string[];
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  fileName: string;
  uploadedById: string;
  createdAt: string;
}

export interface TaskHistoryEntry {
  id: string;
  fieldChanged: string;
  oldValue: string | null;
  newValue: string | null;
  changedById: string;
  changedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  assigneeId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  history: TaskHistoryEntry[];
}

export interface LeaveType {
  id: string;
  name: string;
  daysAllowed: number;
  isPaid: boolean;
}

export interface LeaveBalance {
  userId: string;
  leaveTypeId: string;
  allocated: number;
  used: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason?: string;
  status: LeaveStatus;
  reviewComment?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedById?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingMinutes?: number;
  status: AttendanceStatus;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  assignedUserIds: string[];
}

export interface DocumentCategory {
  id: string;
  name: string;
}

export type DocumentExpiryStatus = "valid" | "expiring_soon" | "expired";

export interface Document {
  id: string;
  ownerId: string;
  categoryId: string;
  fileName: string;
  uploadDate: string;
  expiryDate?: string;
  expiryStatus: DocumentExpiryStatus;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content?: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export type NotificationCategory =
  | "task"
  | "leave"
  | "attendance"
  | "document"
  | "general";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationCategory;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AttendanceRules {
  lateMarkAfterMinutes: number;
  halfDayAfterMinutes: number;
  overtimeAfterMinutes: number;
}

export type AuditLogCategory =
  | "auth"
  | "leave"
  | "attendance"
  | "task"
  | "user"
  | "document"
  | "team"
  | "settings";

/** Phase 1 mock: immutable activity rows; scope in `lib/audit-log-scope.ts`. */
export interface AuditLogEntry {
  id: string;
  occurredAt: string;
  actorUserId: string;
  subjectUserId: string;
  action: string;
  title: string;
  description: string;
  category: AuditLogCategory;
}
