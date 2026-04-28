import type { Role } from "@/lib/types";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  ListTodo,
  CalendarDays,
  CalendarRange,
  Clock,
  CalendarClock,
  Building2,
  LineChart,
  FolderOpen,
  StickyNote,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
};

export type NavSection =
  | { type: "link"; item: NavItem }
  | { type: "group"; label: string; icon: LucideIcon; items: NavItem[] };

function filterByRole(items: NavItem[], role: Role): NavItem[] {
  return items.filter((i) => i.roles.includes(role));
}

function navItem(
  href: string,
  label: string,
  icon: LucideIcon,
  roles: Role[],
): NavItem {
  return { href, label, icon, roles };
}

const NAV_DASHBOARD = navItem("/dashboard", "Dashboard", LayoutDashboard, ["admin", "manager", "employee"]);
const NAV_TASKS = navItem("/tasks", "Tasks", ListTodo, ["admin", "manager", "employee"]);
const NAV_PERFORMANCE = navItem("/performance", "Performance", LineChart, ["admin", "manager", "employee"]);
const NAV_DOCUMENTS = navItem("/documents", "Documents", FolderOpen, ["admin", "manager", "employee"]);
const NAV_NOTES = navItem("/notes", "Notes", StickyNote, ["admin", "manager", "employee"]);
const NAV_SETTINGS = navItem("/settings", "Settings", Settings, ["admin", "manager", "employee"]);

const PEOPLE_TEAMS_ITEMS: NavItem[] = [
  navItem("/users", "Users", Users, ["admin"]),
  navItem("/teams", "Teams", UsersRound, ["admin"]),
];

const LEAVE_SCHEDULING_ITEMS: NavItem[] = [
  navItem("/leave", "Leave", CalendarDays, ["admin", "employee"]),
  navItem("/leave/requests", "Leave Requests", CalendarDays, ["manager"]),
  navItem("/attendance", "Attendance", Clock, ["admin", "manager", "employee"]),
  navItem("/shifts", "Shifts", CalendarClock, ["admin", "employee"]),
];

const NAV_AUDIT_LOG = navItem("/audit-log", "Audit log", ScrollText, ["admin", "manager"]);

const TAIL_LINKS: NavItem[] = [NAV_PERFORMANCE, NAV_DOCUMENTS, NAV_NOTES, NAV_AUDIT_LOG, NAV_SETTINGS];

/**
 * Ordered nav for sidebar / mobile sheet: flat links plus collapsible groups.
 * Notifications are not listed — use the bell → “View all” (`/notifications`).
 */
export function getNavSections(role: Role | null): NavSection[] {
  if (!role) return [];
  const sections: NavSection[] = [];
  sections.push({ type: "link", item: NAV_DASHBOARD });

  const people = filterByRole(PEOPLE_TEAMS_ITEMS, role);
  if (people.length > 1) {
    sections.push({ type: "group", label: "People & teams", icon: Building2, items: people });
  } else if (people.length === 1) {
    sections.push({ type: "link", item: people[0] });
  }

  sections.push({ type: "link", item: NAV_TASKS });

  const leave = filterByRole(LEAVE_SCHEDULING_ITEMS, role);
  if (leave.length > 1) {
    const leaveGroupLabel =
      role === "manager" || role === "employee" ? "Leave & Attendance" : "Leave & scheduling";
    sections.push({ type: "group", label: leaveGroupLabel, icon: CalendarRange, items: leave });
  } else if (leave.length === 1) {
    sections.push({ type: "link", item: leave[0] });
  }

  for (const item of filterByRole(TAIL_LINKS, role)) {
    sections.push({ type: "link", item });
  }
  return sections;
}

/** Flat list in visual order (e.g. mobile bottom bar filter). */
export function flattenNavItems(role: Role | null): NavItem[] {
  return getNavSections(role).flatMap((s) => (s.type === "link" ? [s.item] : s.items));
}

/** @deprecated Use `getNavSections` or `flattenNavItems` */
export function navForRole(role: Role | null): NavItem[] {
  return flattenNavItems(role);
}
