# Phase 1 — Next.js TypeScript Frontend

> **Goal:** Build a complete, responsive Next.js 14+ TypeScript frontend using Tailwind CSS and shadcn/ui. Mock data and simulated auth only — **no real backend** (backend is Phase 2).

**Location:** [companysync/](../companysync/) (Next.js app)  
**Legend:** `✅` done · `❌` not done

---

## Tech Stack

| Layer              | Technology                                     | Status |
| ------------------ | ---------------------------------------------- | ------ |
| Framework          | Next.js 16+ (App Router) + webpack (Windows SWC policy) | ✅ |
| Language           | TypeScript (strict mode)                       | ✅     |
| Styling            | Tailwind CSS v4                                | ✅     |
| Component Library  | shadcn/ui (Base UI)                            | ✅     |
| State Management   | React Context + `useReducer` (mock auth)       | ✅     |
| Routing            | Next.js App Router (`/app`)                    | ✅     |
| Icons              | Lucide React                                   | ✅     |
| Form Handling      | React Hook Form + Zod                          | ✅     |
| Charts             | Recharts                                       | ✅     |
| Notifications (UI) | Sonner                                       | ✅     |

---

## Setup & Scaffolding

- ✅ Initialize Next.js with App Router + TypeScript strict mode
- ✅ Configure Tailwind CSS + shadcn/ui
- ✅ Install dependencies: React Hook Form, Zod, Recharts, Sonner, TanStack Table, date-fns
- ✅ TypeScript interfaces (`lib/types.ts`)
- ✅ Mock auth context (`lib/auth-context.tsx`)
- ✅ Mock data under `lib/mock-data/` (users, teams, tasks, leaves, attendance, shifts, documents, notes, notifications, departments)
- ✅ Root layout + `Providers` (auth + toasts); `/` → `/login`
- ✅ `(auth)/login`, `(auth)/forgot-password`, `(dashboard)/` with `DashboardShell`

---

## Layout Components

- ✅ `components/layout/Sidebar.tsx`
- ✅ `components/layout/Topbar.tsx`
- ✅ `components/layout/MobileNav.tsx`
- ✅ `lib/nav-config.ts`, `lib/route-titles.ts`

---

## Shared Components

- ✅ `DataTable.tsx`, `StatCard.tsx`, `PageHeader.tsx`, `EmptyState.tsx`
- ✅ `ConfirmDialog.tsx`, `FileUpload.tsx`, `PriorityBadge.tsx`
- ✅ `StatusBadge.tsx`, `UserAvatar.tsx`, `NotificationBell.tsx`
- ℹ **Note:** `asChild` is not used with the current shadcn Button; links use `buttonVariants` + `Link`.

---

## Form Components

- ✅ `UserForm.tsx`, `TaskForm.tsx`, `LeaveForm.tsx`, `ShiftForm.tsx`, `NoteForm.tsx`

---

## Dashboard Components

- ✅ `AdminDashboard.tsx`, `ManagerDashboard.tsx`, `EmployeeDashboard.tsx`

---

## Pages (13)

- ✅ **P-01:** Login — `/login`
- ✅ **P-02:** Dashboard — `/dashboard`
- ✅ **P-03:** Users — `/users`, `/users/[id]` (admin)
- ✅ **P-04:** Teams — `/teams` (admin)
- ✅ **P-05:** Tasks — `/tasks`, `/tasks/[id]`
- ✅ **P-06:** Leave — `/leave`, `/leave/requests` (manager)
- ✅ **P-07:** Attendance — `/attendance`
- ✅ **P-08:** Shifts — `/shifts` (admin write; employee read)
- ✅ **P-09:** Performance — `/performance`
- ✅ **P-10:** Documents — `/documents`, `/documents/categories` (categories admin)
- ✅ **P-11:** Notes — `/notes`
- ✅ **P-12:** Notifications — `/notifications` + bell in `Topbar`
- ✅ **P-13:** Settings — `/settings`

---

## Route Guards & Navigation

- ✅ `DashboardShell` redirects unauthenticated users to `/login`
- ✅ `RequireRole` for admin (users, teams, document categories) and manager (`/leave/requests`)
- ✅ Sidebar + mobile nav per PRD (`lib/nav-config.ts`)

---

## Mock Data Requirements

- ✅ All datasets implemented per PRD counts/types

---

## Quality & Deliverables

- ✅ Responsive patterns (sidebar / mobile bar / touch-friendly controls)
- ✅ Forms use React Hook Form + Zod where applicable
- ✅ Kanban + table on Tasks
- ✅ Charts on dashboard variants (Recharts)
- ✅ Navigation wired; mock login/logout
- ℹ **Manual:** Lighthouse / cross-browser QA recommended before production

---

[Back to PRD index](PRD.md) · [Phase 2 — Backend](phase-2.md)
