# companySYNC — Architecture map (living)

Agents read this before Glob-hunting. **Add a row** when you create a new shared/layout/dashboard/form component.

---

## Shell & providers


| Name             | Path                             | Notes                                         |
| ---------------- | -------------------------------- | --------------------------------------------- |
| Root layout      | `app/layout.tsx`                 | Inter + JetBrains Mono + Syne (`next/font`); `<html>` has `dark`; body has `theme-glass` |
| Dashboard layout | `app/(dashboard)/layout.tsx`     | Wraps `DashboardShell`                        |
| Auth layout      | `app/(auth)/layout.tsx`          | Theme toggle slot                             |
| Providers        | `components/providers.tsx`       | ThemeProvider (`attribute="class"`, default `dark`) + Auth + Toaster |
| ThemeProvider    | `components/theme-provider.tsx`  | `next-themes` wrapper                         |
| DashboardShell   | `components/dashboard-shell.tsx` | Owns `sidebarCollapsed`; desktop fixed `Sidebar` + `md:ml-60` / `md:ml-[72px]` on main; mobile `Sheet` + `SidebarPanel`; menu in `Topbar` |


---

## Layout


| Name      | Path                              | Notes                                     |
| --------- | --------------------------------- | ----------------------------------------- |
| Sidebar       | `components/layout/Sidebar.tsx`       | Desktop-only `fixed inset-y-0 left-0 h-screen` frosted aside; props `collapsed` + `onCollapsedChange` from `DashboardShell` |
| SidebarPanel  | `components/layout/sidebar-panel.tsx` | Shared nav; emerald→cyan gradient active rows; profile + logout in bottom glass footer (`mt-auto`) |
| Topbar        | `components/layout/Topbar.tsx`        | Breadcrumb strip only (Home icon → `/dashboard`, chevrons; last crumb current). `onMenuClick`, bell, theme, user |


---

## Shared UI


| Name               | Path                                       | Notes                     |
| ------------------ | ------------------------------------------ | ------------------------- |
| PageHeader         | `components/shared/PageHeader.tsx`         | Client; optional `icon`; default `iconForPath` from `lib/route-titles.ts`; **back** on by default (`fallbackHref` default `/dashboard`) |
| DataTable          | `components/shared/DataTable.tsx`          | TanStack Table            |
| StatCard           | `components/shared/StatCard.tsx`           |                           |
| EmptyState         | `components/shared/EmptyState.tsx`         |                           |
| StatusBadge        | `components/shared/StatusBadge.tsx`        | Task / leave / attendance |
| PriorityBadge      | `components/shared/PriorityBadge.tsx`      |                           |
| UserAvatar         | `components/shared/UserAvatar.tsx`         |                           |
| NotificationBell   | `components/shared/NotificationBell.tsx`   | **View all** → `/notifications` (not in sidebar) |
| ConfirmDialog      | `components/shared/ConfirmDialog.tsx`      |                           |
| FileUpload         | `components/shared/FileUpload.tsx`         |                           |
| AttendanceCalendar | `components/shared/AttendanceCalendar.tsx` | Month grid, `date-fns`    |
| ThemeToggle        | `components/shared/ThemeToggle.tsx`        | Light / dark / system     |


---

## Dashboards & gates


| Name              | Path                                         | Notes            |
| ----------------- | -------------------------------------------- | ---------------- |
| AdminDashboard    | `components/dashboard/AdminDashboard.tsx`    | Charts           |
| ManagerDashboard  | `components/dashboard/ManagerDashboard.tsx`  |                  |
| EmployeeDashboard | `components/dashboard/EmployeeDashboard.tsx` |                  |
| RequireRole       | `components/role-gates.tsx`                  | Client role gate |
| Audit log page    | `app/(dashboard)/audit-log/page.tsx`         | Admin & manager only; mock `mockAuditLogs`; `filterAuditLogsForCurrentUser` in `lib/audit-log-scope.ts` |
| Employee performance detail | `app/(dashboard)/performance/employee/[id]/page.tsx` | Admin & manager; `mockTasks` by assignee, mock HR stats; `RequireRole` + `managerVisibleUserIds` |
| Users page        | `app/(dashboard)/users/page.tsx`             | Admin: stacked role `Card`s (admins → managers → employees), each with `DataTable` |

---

## Forms (`components/forms/`)

UserForm, TaskForm, LeaveForm, ShiftForm, NoteForm — RHF + Zod patterns.

---

## Key patterns

- Tailwind: semantic colors (`bg-card`, `text-muted-foreground`); tokens + SocialSYNC brand (oklch), `theme-glass` background glow, utility classes (`.glass`, `.futuristic-card`, `.text-gradient`, etc.) in `app/globals.css`.
- Links styled as buttons: `buttonVariants` + `Link`, not `Button asChild`.
- Charts: `var(--primary)` / `var(--chart-n)` for fills and strokes.
- Theme: `class` on `<html>`; components use `dark:` for parity.
- Client interactivity: `"use client"` at top of leaf components that need hooks.
- Nav: `lib/nav-config.ts` exports `getNavSections`, `flattenNavItems`; `/notifications` only via bell; `/audit-log` in tail nav (admin & manager). No bottom tab bar.

---

## Stable / sensitive (do not refactor casually)

- `lib/types.ts`
- `lib/mock-data/**`
- `components/ui/**` (generated shadcn / Base UI primitives)

---

## Core lib (non-UI changes = separate task)

- `lib/auth-context.tsx`, `lib/nav-config.ts`, `lib/route-titles.ts`, `lib/audit-log-scope.ts`, `lib/utils.ts`

