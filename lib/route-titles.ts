import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  ListTodo,
  CalendarDays,
  Clock,
  CalendarClock,
  LineChart,
  FolderOpen,
  Folders,
  Settings,
  Bell,
  UserCircle,
  ScrollText,
} from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/teams": "Teams",
  "/tasks": "Tasks",
  "/tasks/new": "Create task",
  "/leave": "Leave",
  "/leave/requests": "Leave requests",
  "/attendance": "Attendance",
  "/attendance/employee": "Employee attendance",
  "/shifts": "Shifts",
  "/performance": "Performance",
  "/documents": "Documents",
  "/documents/categories": "Document categories",
  "/notifications": "Notifications",
  "/audit-log": "Audit log",
  "/settings": "Settings",
  "/login": "Sign in",
  "/register": "Create account",
  "/forgot-password": "Forgot password",
};

const pathIcons: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/users": Users,
  "/teams": UsersRound,
  "/tasks": ListTodo,
  "/leave": CalendarDays,
  "/leave/requests": CalendarDays,
  "/attendance": Clock,
  "/shifts": CalendarClock,
  "/performance": LineChart,
  "/documents": FolderOpen,
  "/documents/categories": Folders,
  "/notifications": Bell,
  "/audit-log": ScrollText,
  "/settings": Settings,
};

export function titleForPath(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/users/")) return "User profile";
  if (pathname.startsWith("/documents/employee/")) return "Employee documents";
  if (pathname.startsWith("/performance/employee/")) return "Employee performance";
  if (pathname.startsWith("/attendance/employee/")) return "Employee attendance";
  if (pathname.startsWith("/tasks/")) return "Task detail";
  return "companySYNC";
}

/** Lucide icon for the current route (for in-page headers). */
export function iconForPath(pathname: string): LucideIcon | undefined {
  if (pathIcons[pathname]) return pathIcons[pathname];
  if (pathname.startsWith("/users/")) return UserCircle;
  if (pathname.startsWith("/documents/employee/")) return FolderOpen;
  if (pathname.startsWith("/performance/employee/")) return LineChart;
  if (pathname.startsWith("/attendance/employee/")) return Clock;
  if (pathname.startsWith("/tasks/")) return ListTodo;
  return undefined;
}

export type BreadcrumbItem = { href: string; label: string; current?: boolean };

export function breadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    crumbs.push({
      href: acc,
      label: titles[acc] ?? seg.replace(/-/g, " "),
    });
  }
  if (crumbs.length > 0) {
    crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1]!, current: true };
  }
  return crumbs;
}
