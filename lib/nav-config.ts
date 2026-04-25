import type { Role } from "@/lib/types";
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
  StickyNote,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "employee"] },
  { href: "/users", label: "Users", icon: Users, roles: ["admin"] },
  { href: "/teams", label: "Teams", icon: UsersRound, roles: ["admin"] },
  { href: "/tasks", label: "Tasks", icon: ListTodo, roles: ["admin", "manager", "employee"] },
  { href: "/leave", label: "Leave", icon: CalendarDays, roles: ["admin", "employee"] },
  { href: "/leave/requests", label: "Leave Requests", icon: CalendarDays, roles: ["manager"] },
  { href: "/attendance", label: "Attendance", icon: Clock, roles: ["admin", "manager", "employee"] },
  { href: "/shifts", label: "Shifts", icon: CalendarClock, roles: ["admin", "employee"] },
  { href: "/performance", label: "Performance", icon: LineChart, roles: ["admin", "manager", "employee"] },
  { href: "/documents", label: "Documents", icon: FolderOpen, roles: ["admin", "manager", "employee"] },
  { href: "/notes", label: "Notes", icon: StickyNote, roles: ["admin", "manager", "employee"] },
  { href: "/notifications", label: "Notifications", icon: Bell, roles: ["admin", "manager", "employee"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["admin", "manager", "employee"] },
];

export const mobilePrimaryHrefs = [
  "/dashboard",
  "/tasks",
  "/attendance",
  "/notifications",
  "/settings",
];

export function navForRole(role: Role | null) {
  if (!role) return [];
  return navItems.filter((item) => item.roles.includes(role));
}
