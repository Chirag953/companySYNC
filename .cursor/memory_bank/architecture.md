# companySYNC — Architecture map (living)

Agents read this before Glob-hunting. **Add a row** when you create a new shared/layout/dashboard/form component.

---

## Key patterns

Read these before writing styled code, charts, motion, or forms.

- Tailwind: semantic colors (`bg-card`, `text-muted-foreground`); tokens + SocialSYNC brand (oklch), `theme-glass` background glow, utility classes (`.glass`, `.futuristic-card`, `.text-gradient`, etc.) in `app/globals.css`.
- Glass cards: `.glass` + `.futuristic-card` from `app/globals.css`; frosted surfaces often use `bg-card/60 backdrop-blur-md border border-white/10` (tune opacity/border to match surrounding cards).
- Links styled as buttons: `buttonVariants` + `Link`, not `Button asChild`.
- Charts: `var(--primary)` / `var(--chart-n)` for fills and strokes.
- Theme: `class` on `<html>`; components use `dark:` for parity.
- Client interactivity: `"use client"` at top of leaf components that need hooks.
- Nav: `lib/nav-config.ts` exports `getNavSections`, `flattenNavItems`; `/notifications` only via bell; `/audit-log` in tail nav (admin & manager). No bottom tab bar.
- Framer Motion entry: `initial={{ opacity: 0, y: 16 }}` → `animate={{ opacity: 1, y: 0 }}`; stagger children with `variants` — see `components/auth/login-form.tsx`.
- RHF + Zod: define `z.object` schema → `useForm<z.infer<typeof schema>>` → `register` fields with `aria-invalid` on error → `handleSubmit` with loading state — see `components/auth/login-form.tsx`.

---

## Shell & providers


| Name             | Path                             | Notes                                                                                                                                     |
| ---------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Root layout      | `app/layout.tsx`                 | Inter + JetBrains Mono + Syne (`next/font`); `<html>` has `dark`; body has `theme-glass`; **metadata.icons** → `/companySYNC-LOGO.png`    |
| Dashboard layout | `app/(dashboard)/layout.tsx`     | Wraps `DashboardShell`                                                                                                                    |
| Auth layout      | `app/(auth)/layout.tsx`          | Theme toggle slot                                                                                                                         |
| Providers        | `components/providers.tsx`       | ThemeProvider (`attribute="class"`, default `dark`) + Auth + Toaster                                                                      |
| ThemeProvider    | `components/theme-provider.tsx`  | `next-themes` wrapper                                                                                                                     |
| DashboardShell   | `components/dashboard-shell.tsx` | Owns `sidebarCollapsed`; desktop fixed `Sidebar` + `md:ml-60` / `md:ml-[72px]` on main; mobile `Sheet` + `SidebarPanel`; menu in `Topbar` |


---

## Layout


| Name         | Path                                  | Notes                                                                                                                                            |
| ------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sidebar      | `components/layout/Sidebar.tsx`       | Desktop-only `fixed inset-y-0 left-0 h-screen` frosted aside; props `collapsed` + `onCollapsedChange` from `DashboardShell`                      |
| SidebarPanel | `components/layout/sidebar-panel.tsx` | Shared nav; **AppLogo** + wordmark (link → `/dashboard`); emerald→cyan gradient active rows; profile + logout in bottom glass footer (`mt-auto`) |
| Topbar       | `components/layout/Topbar.tsx`        | Breadcrumb strip (`AppLogo` → `/dashboard`, chevrons; last crumb current). `onMenuClick`, bell, theme, user                                      |


---

## Shared UI


| Name               | Path                                       | Notes                                                                                                                                   |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| PageHeader         | `components/shared/PageHeader.tsx`         | Client; optional `icon`; default `iconForPath` from `lib/route-titles.ts`; **back** on by default (`fallbackHref` default `/dashboard`) |
| DataTable          | `components/shared/DataTable.tsx`          | TanStack Table                                                                                                                          |
| StatCard           | `components/shared/StatCard.tsx`           |                                                                                                                                         |
| EmptyState         | `components/shared/EmptyState.tsx`         |                                                                                                                                         |
| StatusBadge        | `components/shared/StatusBadge.tsx`        | Task / leave / attendance                                                                                                               |
| PriorityBadge      | `components/shared/PriorityBadge.tsx`      |                                                                                                                                         |
| UserAvatar         | `components/shared/UserAvatar.tsx`         |                                                                                                                                         |
| NotificationBell   | `components/shared/NotificationBell.tsx`   | **View all** → `/notifications` (not in sidebar)                                                                                        |
| ConfirmDialog      | `components/shared/ConfirmDialog.tsx`      |                                                                                                                                         |
| FileUpload         | `components/shared/FileUpload.tsx`         |                                                                                                                                         |
| AttendanceCalendar | `components/shared/AttendanceCalendar.tsx` | Month grid, `date-fns`                                                                                                                  |
| ThemeToggle        | `components/shared/ThemeToggle.tsx`        | Light / dark / system                                                                                                                   |
| AppLogo            | `components/shared/AppLogo.tsx`            | Transparent wrapper; `public/companySYNC-LOGO.png` via `next/image` (`object-contain`, no ring/bg)                                      |
| LoadingState       | `components/shared/LoadingState.tsx`       | Loading / skeleton UI for async surfaces                                                                                                |
| SegmentedControl   | `components/shared/SegmentedControl.tsx`   | Segmented toggle control (e.g. view mode)                                                                                               |
| ChartTooltip       | `components/shared/ChartTooltip.tsx`       | Shared Recharts tooltip content styling                                                                                                 |
| DemoCredentials    | `components/auth/demo-credentials.tsx`     | Collapsible Phase 1 demo emails (login brand strip + mobile form)                                                                       |
| LoginBrandAside    | `components/auth/login-brand-aside.tsx`    | Login desktop marketing column; emerald→cyan gradient; Framer Motion ingress                                                            |
| LoginForm          | `components/auth/login-form.tsx`           | Login card: **RHF + Zod**, Framer stagger, loading submit, forgot + register links                                                      |


---

## Dashboards & gates


| Name                        | Path                                                 | Notes                                                                                                                                                                  |
| --------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AdminDashboard              | `components/dashboard/AdminDashboard.tsx`            | Stat cards + `DashboardStickyBoard` (no chart grid)                                                                                                                    |
| ManagerDashboard            | `components/dashboard/ManagerDashboard.tsx`          | Stats, charts, leaves + `DashboardStickyBoard`                                                                                                                         |
| EmployeeDashboard           | `components/dashboard/EmployeeDashboard.tsx`         | Personal KPIs + `DashboardStickyBoard`                                                                                                                                 |
| DashboardStickyBoard        | `components/dashboard/DashboardStickyBoard.tsx`      | Per-user notes from `mockNotes` + extras; drag; create/edit/delete; `localStorage` layout + `overrides`; **ResizeObserver** + responsive card metrics, safe-area sheet |
| RequireRole                 | `components/role-gates.tsx`                          | Client role gate                                                                                                                                                       |
| Audit log page              | `app/(dashboard)/audit-log/page.tsx`                 | Admin & manager only; mock `mockAuditLogs`; `filterAuditLogsForCurrentUser` in `lib/audit-log-scope.ts`                                                                |
| Employee performance detail | `app/(dashboard)/performance/employee/[id]/page.tsx` | Admin & manager; `mockTasks` by assignee, mock HR stats; `RequireRole` + `managerVisibleUserIds`                                                                       |
| Admin attendance & export   | `app/(dashboard)/attendance/page.tsx`                | Admin: date range, department, search, StatCards, row selection + CSV, links to employee attendance detail; manager: single-day team `DataTable`                       |
| Employee attendance detail  | `app/(dashboard)/attendance/employee/[id]/page.tsx`  | Admin only (`RequireRole`); per-user full history `Table`, date/status filters, summary StatCards, CSV                                                                 |
| Tasks page                  | `app/(dashboard)/tasks/page.tsx`                     | Admin: default table view, `StatCard` summary, filters (status, dept, assignee, creator), enriched `DataTable` + kanban cards; manager/employee unchanged              |
| Users page                  | `app/(dashboard)/users/page.tsx`                     | Admin: stacked role `Card`s (admins → managers → employees), each with `DataTable`                                                                                     |


---

## Forms (`components/forms/`)

UserForm, TaskForm, LeaveForm, ShiftForm, NoteForm — RHF + Zod patterns; `NoteForm` supports optional `submitLabel` (e.g. edit vs create).


| Name      | Path                             | Notes                         |
| --------- | -------------------------------- | ----------------------------- |
| UserForm  | `components/forms/UserForm.tsx`  | User create/edit              |
| TaskForm  | `components/forms/TaskForm.tsx`  | Task create/edit              |
| LeaveForm | `components/forms/LeaveForm.tsx` | Leave request                 |
| ShiftForm | `components/forms/ShiftForm.tsx` | Shift create/edit             |
| NoteForm  | `components/forms/NoteForm.tsx`  | Notes; optional `submitLabel` |


---

## Stable / sensitive (do not refactor casually)

- `lib/types.ts`
- `lib/mock-data/`**
- `components/ui/`** (generated shadcn / Base UI primitives)

---

## Core lib (non-UI changes = separate task)

- `lib/auth-context.tsx`, `lib/nav-config.ts`, `lib/route-titles.ts`, `lib/audit-log-scope.ts`, `lib/attendance-utils.ts`, `lib/utils.ts`