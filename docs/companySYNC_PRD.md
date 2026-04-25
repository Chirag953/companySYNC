# companySYNC — Product Requirements Document (PRD)

> **Version:** 1.0  
> **Status:** Draft  
> **Last Updated:** April 2026  
> **Project:** companySYNC — Workforce Management Platform

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Feature Specifications](#4-feature-specifications)
5. [Phase 1 — Next.js TypeScript Frontend](#phase-1--nextjs-typescript-frontend)
6. [Phase 2 — Backend + Real Authentication](#phase-2--backend--real-authentication)
7. [Phase 3 — Growth](#phase-3--growth)
8. [Non-Functional Requirements](#8-non-functional-requirements)

---

## 1. Product Overview

**companySYNC** is a full-featured, role-based workforce management platform designed to unify employee operations — including task management, attendance, leave, performance, and document management — into a single, intuitive interface.

The platform supports three user roles: **Admin**, **Manager**, and **Employee**, each with dedicated dashboards, feature access, and workflows tailored to their responsibilities.

Users land directly on the **Login page** upon visiting the application. No public-facing homepage exists. Access is entirely role-gated.

---

## 2. Goals & Success Metrics

### Business Goals

- Eliminate fragmented HR tooling by consolidating task, attendance, leave, and document workflows
- Provide real-time visibility into team performance for managers and admins
- Enable scalable multi-team, multi-department organisational structures

### Success Metrics


| Metric                           | Target                        |
| -------------------------------- | ----------------------------- |
| Time-to-first-action after login | < 10 seconds                  |
| Mobile usability score           | ≥ 90 (Lighthouse)             |
| Page load time                   | < 2s on 3G                    |
| Role-based access accuracy       | 100% — zero privilege leakage |
| Notification delivery rate       | ≥ 99%                         |


---

## 3. User Roles & Permissions


| Feature Area                    | Admin             | Manager           | Employee          |
| ------------------------------- | ----------------- | ----------------- | ----------------- |
| User & Team Management          | ✅ Full            | ❌                 | ❌                 |
| Leave Policy Configuration      | ✅ Full            | ❌                 | ❌                 |
| Holiday Calendar Management     | ✅ Full            | ❌                 | ❌                 |
| Shift Definition & Assignment   | ✅ Full            | ❌                 | ❌                 |
| Attendance Rule Configuration   | ✅ Full            | ❌                 | ❌                 |
| Company-wide Analytics          | ✅ Full            | ❌                 | ❌                 |
| Document Category Management    | ✅ Full            | ❌                 | ❌                 |
| Document Access — All Employees | ✅ View + Download | ❌                 | ❌                 |
| Task Assignment to Team         | ❌                 | ✅ Full            | ❌                 |
| Leave Approval / Rejection      | ❌                 | ✅ Full            | ❌                 |
| Team Attendance Monitoring      | ❌                 | ✅ View            | ❌                 |
| Team Performance Review         | ❌                 | ✅ Full            | ❌                 |
| Team Document Access            | ❌                 | ✅ View + Download | ❌                 |
| Task Management (own)           | ❌                 | ❌                 | ✅ Full            |
| Leave Application               | ❌                 | ❌                 | ✅ Full            |
| Attendance Check-in / Check-out | ❌                 | ❌                 | ✅ Full            |
| View Assigned Shift             | ❌                 | ❌                 | ✅ View            |
| Own Document Access             | ❌                 | ❌                 | ✅ View + Download |
| Personal Notes                  | ✅                 | ✅                 | ✅                 |
| Dashboard (role-specific)       | ✅                 | ✅                 | ✅                 |
| Notifications                   | ✅                 | ✅                 | ✅                 |


---

## 4. Feature Specifications

### 4.1 User & Team Management (Admin)

- Create, edit, and deactivate user accounts (Employee and Manager roles)
- Manage personal details: name, address, contact info, profile photo
- Manage job details: designation, department, salary, role
- Create departments and teams
- Assign managers to teams; assign employees to teams

### 4.2 Leave Management

- **Admin:** Define leave types (Sick, Casual, Paid, Unpaid); configure leave policies; maintain holiday calendar; enable automatic leave balance calculation
- **Manager:** Approve or reject employee leave requests with optional comments
- **Employee:** Apply for leave (type, date range, reason); view remaining leave balance; track leave request status

### 4.3 Shift & Attendance Management

- **Admin:** Define shift templates (timings, days); assign shifts to employees or teams; configure attendance rules (late mark thresholds, half-day cutoffs)
- **Manager:** View team attendance records; track working hours and late marks per employee
- **Employee:** Mark daily Check-in / Check-out; automatic calculation of working hours; view assigned shift schedule

### 4.4 Task Management

- **Manager:** Assign tasks to team members; set task priority (High / Medium / Low) and deadlines; create subtasks and checklists; add comments and file attachments; track full task history (who changed what and when)
- **Employee:** View all assigned tasks; optionally create own tasks; update task status (To Do → In Progress → Completed); manage subtasks and checklists; add comments and attachments

### 4.5 Performance & Analytics

- **Admin:** Company-wide performance analytics dashboard; per-employee performance data; aggregated departmental reports
- **Manager:** Team performance summary; monitor productivity trends; track pending tasks and leave requests
- **Employee:** Personal performance view; task completion stats; attendance summary

### 4.6 Document & File Management

- Upload and manage employee documents (PDF, JPG, PNG, DOC, etc.)
- Custom document categories (e.g., Aadhaar Card, PAN Card, Offer Letter, Contracts, Certificates)
- Admin: full CRUD on categories and all employee documents
- Manager: view and download team member documents
- Employee: view and download own documents
- Document version history (track updates and replacements)
- Document expiry dates with automated reminder notifications
- Link documents to individual employee profiles

### 4.7 Personal Productivity — Notes

- All roles can create personal notes
- Each note has a priority level: High / Medium / Low
- Notes are private and visible only to the creator

### 4.8 Real-Time Notification System

- Task assignment and update notifications
- Leave request approval / rejection alerts
- Attendance reminders (Check-in / Check-out)
- Task deadline and overdue task alerts
- Document expiry alerts
- General administrative announcements
- All notifications are role-scoped (users only see notifications relevant to their role)

---

---

# Phase 1 — Next.js TypeScript Frontend

> **Goal:** Build a complete, fully functional, responsive Next.js 14+ TypeScript frontend application using Tailwind CSS and shadcn/ui. All pages must be wired with working navigation. Focus on layout quality, UI/UX, user flows, and role-based rendering. No real backend — use mock data and simulated auth state.

---

## Tech Stack


| Layer              | Technology                                     |
| ------------------ | ---------------------------------------------- |
| Framework          | Next.js 14+ (App Router)                       |
| Language           | TypeScript (strict mode)                       |
| Styling            | Tailwind CSS                                   |
| Component Library  | shadcn/ui                                      |
| State Management   | React Context + `useReducer` (mock auth state) |
| Routing            | Next.js App Router (`/app` directory)          |
| Icons              | Lucide React (bundled with shadcn)             |
| Form Handling      | React Hook Form + Zod                          |
| Charts             | Recharts or shadcn charts                      |
| Notifications (UI) | shadcn `Toast` / `Sonner`                      |


---

## Project Structure

```
companysync/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx               ← Shared sidebar + topbar
│   │   ├── dashboard/page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── teams/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── leave/
│   │   │   ├── page.tsx
│   │   │   └── requests/page.tsx
│   │   ├── attendance/page.tsx
│   │   ├── shifts/page.tsx
│   │   ├── performance/page.tsx
│   │   ├── documents/
│   │   │   ├── page.tsx
│   │   │   └── categories/page.tsx
│   │   ├── notes/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx                   ← Root layout
│   └── page.tsx                     ← Redirect → /login
├── components/
│   ├── ui/                          ← shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNav.tsx
│   ├── shared/
│   │   ├── DataTable.tsx
│   │   ├── StatCard.tsx
│   │   ├── PageHeader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── FileUpload.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── UserAvatar.tsx
│   │   └── NotificationBell.tsx
│   ├── forms/
│   │   ├── UserForm.tsx
│   │   ├── TaskForm.tsx
│   │   ├── LeaveForm.tsx
│   │   ├── ShiftForm.tsx
│   │   └── NoteForm.tsx
│   └── dashboard/
│       ├── AdminDashboard.tsx
│       ├── ManagerDashboard.tsx
│       └── EmployeeDashboard.tsx
├── lib/
│   ├── mock-data/
│   │   ├── users.ts
│   │   ├── tasks.ts
│   │   ├── leaves.ts
│   │   ├── attendance.ts
│   │   └── documents.ts
│   ├── auth-context.tsx             ← Mock auth provider
│   ├── utils.ts
│   └── types.ts
└── public/
    └── assets/
```

---

## Pages & Routing

### Entry Point


| Route        | Behaviour                               |
| ------------ | --------------------------------------- |
| `/`          | Redirect → `/login`                     |
| `/login`     | Login page (no auth required)           |
| `/dashboard` | Role-specific dashboard (auth required) |


### Auth Guard

All `/dashboard/*` routes must be wrapped in an auth guard component. If `authState.user` is null, redirect to `/login`. On successful login (mock), set user role context and redirect to `/dashboard`.

---

## Page Specifications

### P-01: Login Page (`/login`)

**Layout:** Full-screen centered card, companySYNC branding (logo + name), left decorative panel on desktop (brand image / illustration), right panel with form.

**Components:**

- `Input` — email field
- `Input` — password field (toggle visibility)
- `Button` — "Sign In" (primary, full-width)
- `Checkbox` — "Remember me"
- `Link` — "Forgot password?" (leads to a placeholder forgot-password page)

**Behaviour (mock):**

- Hardcode 3 test credentials (one per role: [admin@company.com](mailto:admin@company.com), [manager@company.com](mailto:manager@company.com), [employee@company.com](mailto:employee@company.com), password: `password`)
- On submit, set auth context with user object + role
- Redirect to `/dashboard`
- Show `Toast` on invalid credentials

**Responsive:** Single-column on mobile; two-column on desktop.

---

### P-02: Dashboard (`/dashboard`)

Renders one of three dashboard components based on role:

**Admin Dashboard:**

- Stat cards: Total Employees, Active Teams, Pending Leave Requests, Documents Expiring Soon
- Bar chart: Department-wise headcount
- Line chart: Attendance trend (last 30 days)
- Doughnut chart: Leave type distribution
- Quick-action buttons: Add User, Create Team, Review Leaves

**Manager Dashboard:**

- Stat cards: Team Size, Pending Tasks, Approved Leaves This Month, Late Marks This Week
- Task status distribution (To Do / In Progress / Completed)
- Team attendance table (today's status per team member)
- Pending leave requests list with Approve / Reject buttons

**Employee Dashboard:**

- Stat cards: Tasks Assigned, Tasks Completed, Leave Balance, Today's Shift
- Check-in / Check-out button with live clock and timer
- My Tasks — top 5 upcoming with status pills
- My Attendance — last 7 days attendance strip

---

### P-03: User Management (`/users`) — Admin Only

**List view:**

- `DataTable` with columns: Avatar + Name, Designation, Department, Role (badge), Status (Active / Inactive)
- Search bar (filter by name / department)
- Filters: Role, Department, Status
- "Add User" button → opens `Sheet` (slide-over) with `UserForm`

**User Detail (`/users/[id]`):**

- Profile card: avatar, name, role badge, contact info
- Tabbed layout:
  - **Overview** — personal info, job details (editable for Admin)
  - **Documents** — linked documents list with upload button
  - **Attendance** — attendance history table
  - **Leave** — leave history and current balance
  - **Tasks** — assigned tasks list
- Edit button → inline form editing with `Save / Cancel`

---

### P-04: Team Management (`/teams`) — Admin Only

- Team cards grid: team name, manager, member count, department
- "Create Team" button → `Dialog` with team creation form (name, department, manager assignment, member selection via `MultiSelect`)
- Each team card: click → team detail slide-over showing member list and task summary

---

### P-05: Task Management (`/tasks`)

**All Roles — different data scope:**

- **Admin:** Views all tasks across company (read-only)
- **Manager:** Full CRUD — create, assign, edit, delete tasks for their team
- **Employee:** View assigned tasks; update status; create personal tasks

**List View:**

- Toggle between **Kanban Board** (3 columns: To Do / In Progress / Completed) and **Table View**
- Filters: Priority, Assignee, Due Date, Status
- "Create Task" button (Manager / Employee)

**Task Detail (`/tasks/[id]`):**

- Task title, description, assignee avatar, priority badge, due date, status selector
- Subtasks checklist (add / check off / delete)
- Comments section (threaded, with timestamps and user avatars)
- Attachments section (file list with upload)
- Task history log (who changed what and when) — collapsible

---

### P-06: Leave Management (`/leave`)

**Employee view:**

- Leave balance cards per type (Sick / Casual / Paid / Unpaid) with progress bars
- "Apply for Leave" button → `Dialog` with `LeaveForm` (type, start date, end date, reason)
- Leave history table: Type, Dates, Days, Status badge, Applied On

**Manager view (`/leave/requests`):**

- Pending requests list: Employee name + avatar, leave type, dates, days count, reason
- Action buttons: Approve (green) / Reject (red) with optional comment dialog
- Approved/Rejected history table below

**Admin view (`/leave`):**

- Tab 1: **Policies** — list of leave types with allocation counts; edit button; "Add Leave Type" button
- Tab 2: **Holiday Calendar** — monthly calendar view with public holidays marked; "Add Holiday" button
- Tab 3: **All Requests** — company-wide leave request table with filters

---

### P-07: Attendance (`/attendance`)

**Employee view:**

- Large Check-in / Check-out button (state-aware — shows current status)
- Live working hours timer (after check-in)
- Today's summary: Check-in time, Check-out time, Total Hours
- Monthly attendance calendar heatmap (Present / Absent / Half-Day / Late)

**Manager view:**

- Team attendance table for today: Name, Check-in, Check-out, Hours, Status (On Time / Late / Absent)
- Date picker to view historical records
- Summary stats: Present %, Late %, Absent %

**Admin view:**

- All of the above + attendance rule configuration panel (Late mark cutoff, Half-day cutoff, Overtime rules)

---

### P-08: Shift Management (`/shifts`)

**Admin view:**

- Shift templates list (Morning / Evening / Night + custom): Start time, End time, Days, Assigned Count
- "Create Shift" button → `ShiftForm` in a `Dialog`
- "Assign Shift" → Employee multi-select with shift picker

**Employee view:**

- Weekly shift schedule view (calendar-style, current week by default)
- Shift details card: shift name, timing, days

---

### P-09: Performance (`/performance`)

**Admin:** 

- Company-wide leaderboard table: employee, tasks completed, attendance %, on-time rate
- Department comparison bar charts
- Filter by department, date range

**Manager:**

- Team performance table: same columns, scoped to team
- Individual employee detail card on row click

**Employee:**

- Personal stats: tasks completed, completion rate, attendance %, on-time rate
- Line chart: performance trend over 30 / 60 / 90 days

---

### P-10: Document Management (`/documents`)

**Admin view:**

- Tab 1: **All Documents** — searchable table: Employee, Category, File Name, Upload Date, Expiry Date, Status (Valid / Expiring Soon / Expired)
  - Upload, Download, Delete actions per row
- Tab 2: **Categories** — manage document categories (CRUD); list of categories with edit / delete icons; "Add Category" button

**Manager view:**

- Same as All Documents but filtered to their team members only; no delete permission

**Employee view:**

- Own documents list grouped by category
- Download button per document; no delete

**Shared:**

- `FileUpload` component: drag-and-drop zone + file type validation
- Expiry date picker (optional)
- On upload: link to employee profile and selected category

---

### P-11: Notes (`/notes`) — All Roles

- Notes grid: card per note showing title, excerpt, priority badge (colour-coded: red/yellow/blue), created date
- "New Note" button → `NoteForm` in a `Sheet` (title, body `Textarea`, priority `Select`)
- Click note card → expand to full view in a `Dialog` with Edit and Delete options
- Filter by priority

---

### P-12: Notifications (`/notifications`) — All Roles

- Full notifications list (paginated)
- Filter tabs: All / Unread / Tasks / Leave / Attendance / Documents
- Each notification: icon, title, body, timestamp, read/unread dot
- "Mark all as read" button
- `NotificationBell` component in `Topbar` with unread count badge

---

### P-13: Settings (`/settings`)

- **Profile Settings** — editable name, contact, profile photo upload (all roles)
- **Change Password** — (mock form, Phase 2 activates real logic)
- **Admin only:**
  - Company profile (name, logo)
  - Department management

---

## Reusable Components

### Layout Components


| Component   | Description                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| `Sidebar`   | Collapsible left sidebar; role-aware nav links; active state; companySYNC logo; user avatar + name at bottom |
| `Topbar`    | Page title, breadcrumb, notification bell with badge, user dropdown (Profile / Logout)                       |
| `MobileNav` | Bottom tab bar on mobile; hamburger → sheet drawer on tablet                                                 |


### Shared Components


| Component          | Description                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `DataTable`        | Reusable table with sorting, pagination, search, column visibility toggle (built on TanStack Table) |
| `StatCard`         | Icon, label, value, optional trend arrow + percentage                                               |
| `PageHeader`       | Title, description, optional action button — consistent across all pages                            |
| `EmptyState`       | Illustration, heading, sub-text, optional CTA button                                                |
| `ConfirmDialog`    | Generic "Are you sure?" dialog with confirm / cancel                                                |
| `FileUpload`       | Drag-and-drop zone with accepted file types, size limit display                                     |
| `PriorityBadge`    | Coloured badge: High (red) / Medium (yellow) / Low (blue)                                           |
| `StatusBadge`      | Coloured badge for task status, leave status, attendance status                                     |
| `UserAvatar`       | Initials fallback, image support, size variants (sm / md / lg)                                      |
| `NotificationBell` | Bell icon with animated badge; popover shows latest 5 notifications                                 |


---

## Routing & Navigation

### Sidebar Navigation (role-scoped)

**Admin:**

- Dashboard, Users, Teams, Tasks, Leave, Attendance, Shifts, Performance, Documents, Notes, Notifications, Settings

**Manager:**

- Dashboard, Tasks, Leave Requests, Attendance, Performance, Documents, Notes, Notifications, Settings

**Employee:**

- Dashboard, Tasks, Leave, Attendance, Shifts, Documents, Notes, Notifications, Settings

### Route Guards

```
/                    →  redirect /login
/login               →  public
/dashboard/*         →  requireAuth()  →  redirect /login if unauthenticated
/users/*             →  requireRole('admin')
/teams               →  requireRole('admin')
/leave/requests      →  requireRole('manager')
/shifts (write ops)  →  requireRole('admin')
```

---

## Responsiveness


| Breakpoint          | Layout                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| Mobile (< 640px)    | Sidebar hidden; bottom navigation bar; single-column layouts; stacked cards |
| Tablet (640–1024px) | Collapsed icon-only sidebar; 2-column grids                                 |
| Desktop (> 1024px)  | Full expanded sidebar; multi-column grids; wide data tables                 |


All shadcn components and Tailwind responsive utilities must be used consistently. Touch targets ≥ 44px. No horizontal scroll on any viewport.

---

## Mock Data Requirements (Phase 1)

Define TypeScript interfaces and mock arrays for:

- `User[]` — 10–15 users across roles and departments
- `Team[]` — 3–4 teams with manager and member assignments
- `Task[]` — 20+ tasks with varied statuses, priorities, assignees
- `LeaveRequest[]` — mix of pending / approved / rejected
- `AttendanceRecord[]` — 30-day history per user
- `Shift[]` — 3 shift templates with assignments
- `Document[]` — various categories, some expiring
- `Note[]` — personal notes per user
- `Notification[]` — mix of types per role

---

## Phase 1 Deliverables

- Complete Next.js 14+ TypeScript project (App Router)
- All 13 pages implemented and routed correctly
- All reusable components built and used consistently
- Role-based rendering on every page (admin / manager / employee)
- Working navigation — all buttons and links functional
- Mock auth context with login / logout
- Responsive layout verified at mobile / tablet / desktop
- Kanban board and table toggle on Tasks page
- Charts rendered on all dashboard pages
- All forms with validation (React Hook Form + Zod)

---

---

# Phase 2 — Backend + Real Authentication

> **Goal:** Implement production-grade backend APIs entirely within the **same Next.js project** using App Router Route Handlers (`app/api/**/route.ts`). Replace all mock data with real PostgreSQL database operations and integrate real authentication using NextAuth.js v5. No separate server — everything lives in one Next.js monorepo.

---

## Tech Stack


| Layer                   | Technology                                                   |
| ----------------------- | ------------------------------------------------------------ |
| Framework               | Next.js 14+ (App Router) — same project as Phase 1           |
| API Layer               | Next.js Route Handlers (`app/api/**/route.ts`)               |
| Language                | TypeScript (strict mode)                                     |
| Database                | PostgreSQL                                                   |
| ORM                     | Prisma                                                       |
| Authentication          | NextAuth.js v5 (Credentials provider + JWT session strategy) |
| Password Hashing        | bcrypt                                                       |
| File Storage            | AWS S3 or Cloudflare R2 (documents & attachments)            |
| File Upload             | Next.js built-in `formData()` parsing in Route Handlers      |
| Real-Time Notifications | Pusher or Ably (serverless-compatible; replaces Socket.IO)   |
| Validation              | Zod (shared between frontend forms and API route handlers)   |
| Middleware              | Next.js `middleware.ts` for auth guards and role enforcement |
| Testing                 | Vitest + Playwright (E2E)                                    |
| Containerisation        | Docker Compose (PostgreSQL only)                             |


---

## Project Structure — API Layer (added to Phase 1 project)

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts          ← NextAuth.js handler (GET + POST)
│   ├── users/
│   │   ├── route.ts              ← GET (list), POST (create)
│   │   └── [id]/
│   │       ├── route.ts          ← GET, PUT, DELETE
│   │       └── status/route.ts   ← PATCH (activate/deactivate)
│   ├── teams/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       └── members/
│   │           ├── route.ts
│   │           └── [userId]/route.ts
│   ├── tasks/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── status/route.ts
│   │       ├── subtasks/
│   │       │   ├── route.ts
│   │       │   └── [subId]/route.ts
│   │       ├── comments/
│   │       │   ├── route.ts
│   │       │   └── [commentId]/route.ts
│   │       ├── attachments/
│   │       │   ├── route.ts
│   │       │   └── [attachId]/route.ts
│   │       └── history/route.ts
│   ├── leave/
│   │   ├── types/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── balance/
│   │   │   ├── route.ts
│   │   │   └── [userId]/route.ts
│   │   ├── requests/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── holidays/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── attendance/
│   │   ├── checkin/route.ts
│   │   ├── checkout/route.ts
│   │   ├── today/route.ts
│   │   ├── team/route.ts
│   │   ├── all/route.ts
│   │   ├── rules/route.ts
│   │   └── route.ts
│   ├── shifts/
│   │   ├── route.ts
│   │   ├── assign/route.ts
│   │   ├── my/route.ts
│   │   └── [id]/route.ts
│   ├── performance/
│   │   ├── route.ts
│   │   ├── team/route.ts
│   │   └── company/route.ts
│   ├── documents/
│   │   ├── route.ts
│   │   ├── [id]/route.ts
│   │   └── categories/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── notes/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── notifications/
│   │   ├── route.ts
│   │   ├── read-all/route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       └── read/route.ts
│   └── cron/
│       ├── attendance-reminder/route.ts
│       ├── document-expiry/route.ts
│       ├── leave-balance-reset/route.ts
│       └── overdue-tasks/route.ts
├── middleware.ts                  ← Auth guard + role enforcement
lib/
├── prisma.ts                      ← Prisma client singleton
├── auth.ts                        ← NextAuth config
├── session.ts                     ← getServerSession helper
├── pusher.ts                      ← Pusher server client
├── s3.ts                          ← S3/R2 upload helper
├── resend.ts                      ← Email client
└── cron-secret.ts                 ← Cron auth validation
prisma/
├── schema.prisma
└── migrations/
```

---

## Authentication — NextAuth.js v5

### Configuration (`lib/auth.ts`)

- **Provider:** `CredentialsProvider` — accepts email + password
- **Session strategy:** `jwt` (no database session table needed)
- **JWT payload:** `{ id, email, role, name }` — role is embedded so every Route Handler can read it without a DB call
- **Session expiry:** 8 hours (access); refresh on activity
- `**authorize` callback:** query user from Prisma → verify password with bcrypt → return user object or `null`
- `**jwt` callback:** embed `role` into JWT token
- `**session` callback:** expose `role` and `id` on `session.user`

### Password Security

- bcrypt with salt rounds = 12
- Passwords never returned in any API response (Prisma `select` excludes `password_hash`)

### Forgot Password Flow

- `POST /api/auth/forgot-password` — generate a secure random token, store hashed in DB with 15-min expiry, send email via Resend
- `POST /api/auth/reset-password` — validate token, update password, invalidate token

### Next.js `middleware.ts` — Route Protection

```
/login               → public (redirect to /dashboard if already authed)
/dashboard/*         → requireAuth() — redirect /login if no session
/api/users/*         → requireRole('admin')
/api/teams/*         → requireRole('admin')
/api/leave/requests  → requireRole('manager', 'admin') for PATCH
/api/cron/*          → requireCronSecret (CRON_SECRET header)
```

Role enforcement in `middleware.ts` reads `token.role` from the NextAuth JWT — zero DB queries at the edge.

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  admin
  manager
  employee
}

enum Priority {
  high
  medium
  low
}

enum TaskStatus {
  todo
  in_progress
  completed
}

enum LeaveStatus {
  pending
  approved
  rejected
}

enum AttendanceStatus {
  present
  absent
  half_day
  late
}

model User {
  id               String   @id @default(uuid())
  email            String   @unique
  passwordHash     String
  firstName        String
  lastName         String
  phone            String?
  address          String?
  profilePhotoUrl  String?
  designation      String?
  salary           Decimal?
  role             Role     @default(employee)
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  department       Department?       @relation(fields: [departmentId], references: [id])
  departmentId     String?

  managedTeams     Team[]            @relation("TeamManager")
  teamMemberships  TeamMember[]
  assignedTasks    Task[]            @relation("TaskAssignee")
  createdTasks     Task[]            @relation("TaskCreator")
  taskComments     TaskComment[]
  taskAttachments  TaskAttachment[]
  taskHistories    TaskHistory[]
  leaveRequests    LeaveRequest[]    @relation("LeaveRequester")
  reviewedLeaves   LeaveRequest[]    @relation("LeaveReviewer")
  leaveBalances    LeaveBalance[]
  attendanceRecords Attendance[]
  shiftAssignments ShiftAssignment[]
  documents        Document[]        @relation("DocumentOwner")
  uploadedDocuments Document[]       @relation("DocumentUploader")
  documentCategories DocumentCategory[]
  notes            Note[]
  notifications    Notification[]
  passwordResets   PasswordReset[]
}

model Department {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  users     User[]
  teams     Team[]
}

model Team {
  id           String       @id @default(uuid())
  name         String
  createdAt    DateTime     @default(now())
  department   Department?  @relation(fields: [departmentId], references: [id])
  departmentId String?
  manager      User         @relation("TeamManager", fields: [managerId], references: [id])
  managerId    String
  members      TeamMember[]
}

model TeamMember {
  team   Team   @relation(fields: [teamId], references: [id])
  teamId String
  user   User   @relation(fields: [userId], references: [id])
  userId String
  @@id([teamId, userId])
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  priority    Priority   @default(medium)
  status      TaskStatus @default(todo)
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  assignee    User       @relation("TaskAssignee", fields: [assigneeId], references: [id])
  assigneeId  String
  createdBy   User       @relation("TaskCreator", fields: [createdById], references: [id])
  createdById String
  subtasks    Subtask[]
  comments    TaskComment[]
  attachments TaskAttachment[]
  history     TaskHistory[]
}

model Subtask {
  id          String  @id @default(uuid())
  title       String
  isCompleted Boolean @default(false)
  task        Task    @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId      String
}

model TaskComment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId    String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
}

model TaskAttachment {
  id         String   @id @default(uuid())
  fileUrl    String
  fileName   String
  createdAt  DateTime @default(now())
  task       Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId     String
  uploadedBy User     @relation(fields: [uploadedById], references: [id])
  uploadedById String
}

model TaskHistory {
  id           String   @id @default(uuid())
  fieldChanged String
  oldValue     String?
  newValue     String?
  changedAt    DateTime @default(now())
  task         Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId       String
  changedBy    User     @relation(fields: [changedById], references: [id])
  changedById  String
}

model LeaveType {
  id          String         @id @default(uuid())
  name        String         @unique
  daysAllowed Int
  isPaid      Boolean        @default(true)
  requests    LeaveRequest[]
  balances    LeaveBalance[]
}

model LeaveBalance {
  allocated   Int
  used        Int           @default(0)
  user        User          @relation(fields: [userId], references: [id])
  userId      String
  leaveType   LeaveType     @relation(fields: [leaveTypeId], references: [id])
  leaveTypeId String
  @@id([userId, leaveTypeId])
}

model LeaveRequest {
  id            String      @id @default(uuid())
  startDate     DateTime
  endDate       DateTime
  daysCount     Int
  reason        String?
  status        LeaveStatus @default(pending)
  reviewComment String?
  appliedAt     DateTime    @default(now())
  reviewedAt    DateTime?
  user          User        @relation("LeaveRequester", fields: [userId], references: [id])
  userId        String
  leaveType     LeaveType   @relation(fields: [leaveTypeId], references: [id])
  leaveTypeId   String
  reviewedBy    User?       @relation("LeaveReviewer", fields: [reviewedById], references: [id])
  reviewedById  String?
}

model Holiday {
  id   String   @id @default(uuid())
  name String
  date DateTime
}

model Shift {
  id          String            @id @default(uuid())
  name        String
  startTime   String
  endTime     String
  days        String[]
  assignments ShiftAssignment[]
}

model ShiftAssignment {
  user          User      @relation(fields: [userId], references: [id])
  userId        String
  shift         Shift     @relation(fields: [shiftId], references: [id])
  shiftId       String
  effectiveFrom DateTime?
  effectiveTo   DateTime?
  @@id([userId, shiftId])
}

model Attendance {
  id             String           @id @default(uuid())
  date           DateTime
  checkIn        DateTime?
  checkOut       DateTime?
  workingMinutes Int?
  status         AttendanceStatus @default(present)
  user           User             @relation(fields: [userId], references: [id])
  userId         String
  @@unique([userId, date])
}

model AttendanceRule {
  id                   String @id @default(uuid())
  lateMarkAfterMinutes Int    @default(15)
  halfDayAfterMinutes  Int    @default(240)
  overtimeAfterMinutes Int    @default(480)
}

model DocumentCategory {
  id        String     @id @default(uuid())
  name      String     @unique
  createdAt DateTime   @default(now())
  createdBy User       @relation(fields: [createdById], references: [id])
  createdById String
  documents Document[]
}

model Document {
  id         String           @id @default(uuid())
  fileName   String
  fileUrl    String
  fileType   String?
  expiryDate DateTime?
  version    Int              @default(1)
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt
  owner      User             @relation("DocumentOwner", fields: [ownerId], references: [id])
  ownerId    String
  category   DocumentCategory @relation(fields: [categoryId], references: [id])
  categoryId String
  uploadedBy User             @relation("DocumentUploader", fields: [uploadedById], references: [id])
  uploadedById String
}

model Note {
  id        String   @id @default(uuid())
  title     String
  content   String?
  priority  Priority @default(medium)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  userId    String
}

model Notification {
  id        String   @id @default(uuid())
  type      String
  title     String
  body      String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
}

model PasswordReset {
  id        String   @id @default(uuid())
  tokenHash String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
}
```

---

## API Route Handlers

All Route Handlers follow this pattern:

```ts
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // role check, DB query, return response
}
```

### Auth (`/api/auth/[...nextauth]`)

```
GET  /api/auth/[...nextauth]   → NextAuth session/csrf handlers
POST /api/auth/[...nextauth]   → NextAuth signin/signout handlers
POST /api/auth/forgot-password → generate reset token, email link
POST /api/auth/reset-password  → validate token, update password
```

### Users

```
GET    /api/users              → Admin: list with ?role=&department=&status=
POST   /api/users              → Admin: create user (hash password with bcrypt)
GET    /api/users/[id]         → Admin: full user detail
PUT    /api/users/[id]         → Admin: update personal + job details
PATCH  /api/users/[id]/status  → Admin: toggle isActive
DELETE /api/users/[id]         → Admin: soft delete (set isActive=false)
```

### Teams

```
GET    /api/teams              → Admin: list all teams
POST   /api/teams              → Admin: create team
GET    /api/teams/[id]         → Admin: team detail with members
PUT    /api/teams/[id]         → Admin: update team
DELETE /api/teams/[id]         → Admin
POST   /api/teams/[id]/members → Admin: add member(s)
DELETE /api/teams/[id]/members/[userId] → Admin: remove member
```

### Tasks

```
GET    /api/tasks                          → role-scoped list
POST   /api/tasks                          → Manager / Employee
GET    /api/tasks/[id]                     → task detail
PUT    /api/tasks/[id]                     → Manager
DELETE /api/tasks/[id]                     → Manager
PATCH  /api/tasks/[id]/status              → Employee: update status (triggers TaskHistory entry + Pusher event)
POST   /api/tasks/[id]/subtasks            → create subtask
PATCH  /api/tasks/[id]/subtasks/[subId]    → toggle or rename
DELETE /api/tasks/[id]/subtasks/[subId]
POST   /api/tasks/[id]/comments            → add comment
DELETE /api/tasks/[id]/comments/[commentId]
POST   /api/tasks/[id]/attachments         → multipart/form-data → upload to S3/R2
DELETE /api/tasks/[id]/attachments/[attachId]
GET    /api/tasks/[id]/history             → full change log
```

### Leave

```
GET    /api/leave/types                → list leave types
POST   /api/leave/types                → Admin
PUT    /api/leave/types/[id]           → Admin
DELETE /api/leave/types/[id]           → Admin
GET    /api/leave/balance              → Employee: own balance
GET    /api/leave/balance/[userId]     → Admin / Manager
POST   /api/leave/requests             → Employee: apply
GET    /api/leave/requests             → role-scoped list
GET    /api/leave/requests/[id]
PATCH  /api/leave/requests/[id]        → Manager/Admin: approve or reject (updates LeaveBalance, triggers Pusher notification)
GET    /api/leave/holidays             → list holidays
POST   /api/leave/holidays             → Admin
DELETE /api/leave/holidays/[id]        → Admin
```

### Attendance

```
POST   /api/attendance/checkin         → Employee: create/update today's record
POST   /api/attendance/checkout        → Employee: set checkOut, calculate workingMinutes, set status
GET    /api/attendance/today           → Employee: today's record
GET    /api/attendance                 → Employee: own history (paginated)
GET    /api/attendance/team            → Manager: team's records, ?date=
GET    /api/attendance/all             → Admin: all records with filters
GET    /api/attendance/rules           → Admin
PUT    /api/attendance/rules           → Admin
```

### Shifts

```
GET    /api/shifts                     → Admin: all shifts
POST   /api/shifts                     → Admin: create
PUT    /api/shifts/[id]                → Admin
DELETE /api/shifts/[id]                → Admin
POST   /api/shifts/assign              → Admin: assign shift to user(s)
GET    /api/shifts/my                  → Employee: own assigned shift
```

### Performance

```
GET    /api/performance                → Employee: own stats
GET    /api/performance/team           → Manager: team stats
GET    /api/performance/company        → Admin: company-wide
```

> Performance is computed from existing Attendance + Task data — no separate performance table required.

### Documents

```
GET    /api/documents                  → role-scoped list
POST   /api/documents                  → multipart upload → S3/R2 → save record
GET    /api/documents/[id]             → file metadata
DELETE /api/documents/[id]             → Admin: delete record + S3 object
GET    /api/documents/categories       → list
POST   /api/documents/categories       → Admin
PUT    /api/documents/categories/[id]  → Admin
DELETE /api/documents/categories/[id]  → Admin
```

### Notes

```
GET    /api/notes                      → own notes only (userId from session)
POST   /api/notes
PUT    /api/notes/[id]
DELETE /api/notes/[id]
```

### Notifications

```
GET    /api/notifications              → own notifications, ?unread=true
PATCH  /api/notifications/[id]/read    → mark one as read
PATCH  /api/notifications/read-all     → mark all as read
DELETE /api/notifications/[id]
```

### Cron Jobs (`/api/cron/*`)

All cron routes verify `Authorization: Bearer ${CRON_SECRET}` before executing.

```
GET /api/cron/attendance-reminder    → runs daily at 8:45 AM and 6:00 PM
GET /api/cron/document-expiry        → runs daily at 9:00 AM
GET /api/cron/leave-balance-reset    → runs January 1 annually
GET /api/cron/overdue-tasks          → runs daily at 10:00 AM
```

Configure in `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/attendance-reminder", "schedule": "45 8 * * *" },
    { "path": "/api/cron/attendance-reminder", "schedule": "0 18 * * *" },
    { "path": "/api/cron/document-expiry",     "schedule": "0 9 * * *" },
    { "path": "/api/cron/overdue-tasks",       "schedule": "0 10 * * *" },
    { "path": "/api/cron/leave-balance-reset", "schedule": "0 0 1 1 *" }
  ]
}
```

---

## Real-Time Notifications — Pusher

Pusher is used instead of Socket.IO because Next.js Route Handlers run as serverless functions and cannot maintain persistent WebSocket connections.

**Server side** (`lib/pusher.ts`): Pusher server client triggers events after DB writes.

```ts
await pusher.trigger(`user-${userId}`, 'notification', { title, body, type })
```

**Client side**: Pusher JS client subscribes on login, listens for events, and updates the notification bell badge in real time via React state.

---

## File Uploads — S3 / Cloudflare R2

- Route Handler receives `formData()`, extracts the file `Blob`
- Uploads to S3/R2 using AWS SDK v3 (`PutObjectCommand`)
- Stores the resulting public URL in the `Document` or `TaskAttachment` Prisma record
- For downloads, generate a pre-signed URL (15-min expiry) via `GetObjectCommand`

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://companysync.app

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
S3_BUCKET_NAME=companysync-docs

PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=ap2
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

RESEND_API_KEY=...
FROM_EMAIL=noreply@companysync.app

CRON_SECRET=...
```

---

## Phase 2 Deliverables

- Prisma schema with all models and migrations applied
- NextAuth.js v5 with Credentials provider, bcrypt, JWT session
- `middleware.ts` enforcing auth guard and role-based access at the edge
- All Route Handlers implemented and role-scoped
- Forgot password + reset password flow with Resend email
- File upload to S3/R2 for documents and task attachments (pre-signed download URLs)
- Pusher integration for real-time notification delivery
- Vercel Cron Jobs for attendance reminders, document expiry, overdue tasks, leave reset
- Frontend: mock auth context replaced with `useSession` from NextAuth
- Frontend: all mock data replaced with `fetch` calls to Route Handlers
- Docker Compose for local PostgreSQL setup
- Zod validation on every Route Handler input
- Vitest unit tests for critical business logic (leave balance calculation, attendance status, etc.)
- Playwright E2E tests for login, check-in/out, task update, leave apply → approve flow

---

---

# Phase 3 — Growth

> **Goal:** Expand companySYNC into an enterprise-ready platform with advanced analytics, integrations, AI-powered features, compliance tools, and multi-tenant support.

---

## 3.1 Advanced Reporting & Analytics

- Exportable reports (PDF / CSV / Excel) for Attendance, Leave, Performance, and Payroll summary
- Custom report builder: pick date range, department, employee, metric
- Scheduled report delivery via email (weekly / monthly)
- Executive summary dashboard with KPIs and trend projections

## 3.2 Payroll Integration (Phase 3A)

- Payroll summary auto-calculation from attendance + leave data
- Salary slip generation (PDF)
- Configurable pay components (basic, HRA, deductions)
- Export payroll data to accounting tools (Tally, QuickBooks, Zoho Books)

## 3.3 AI-Powered Features

- **AI Task Prioritiser:** Suggest task priorities based on deadlines, workload, and historical completion patterns
- **Smart Leave Insights:** Predict leave trends and flag understaffing risks
- **Performance Coaching:** Auto-generated performance summaries for managers based on task and attendance data
- **Document OCR & Auto-categorisation:** Upload a document and AI detects the type (e.g., Aadhaar, PAN) and suggests the category

## 3.4 Calendar & Scheduling

- Integrated team calendar: holidays, leaves, task deadlines, shift schedules in one view
- Google Calendar and Outlook sync (OAuth)
- Conflict detection when scheduling shifts or assigning tasks

## 3.5 Multi-Tenant Support

- Organisation-level isolation in DB (tenant_id on all tables)
- Custom subdomain per organisation (e.g., `acmecorp.companysync.app`)
- Per-tenant branding: logo, primary colour, company name
- Subscription plans: Starter / Business / Enterprise

## 3.6 Mobile Application

- React Native (Expo) app for iOS and Android
- Core features: attendance check-in/out (with GPS verification), task management, leave application, notifications
- Offline mode: queue attendance and task updates for sync on reconnect
- Biometric login (FaceID / fingerprint)

## 3.7 Integrations & API Platform

- Public REST API with API key management (for third-party integrations)
- Webhook support: trigger external systems on companySYNC events
- Slack integration: receive notifications in Slack; approve leave requests via Slack commands
- Microsoft Teams integration
- SSO: SAML 2.0 and OAuth 2.0 (Google Workspace, Microsoft Entra ID)

## 3.8 Compliance & Security Enhancements

- Complete audit log: every data change recorded with user, timestamp, IP
- Data retention policies: configurable auto-purge for old records
- GDPR compliance: right to access, right to erasure workflows
- Two-factor authentication (TOTP / SMS)
- Session management: view and revoke active sessions
- Role-level data masking (e.g., hide salary from non-admin roles)

## 3.9 Employee Self-Service Portal Enhancements

- IT asset tracking: assign laptops, access cards; employee can view assigned assets
- Helpdesk / HR ticket system: employee raises HR queries; admin / manager responds
- Announcement board: admin posts company-wide announcements with read receipts
- Employee directory: searchable org chart with team hierarchy visualisation
- Birthday and work anniversary reminders

## 3.10 Infrastructure & Reliability

- CDN deployment (Cloudflare / AWS CloudFront)
- Horizontal auto-scaling for API servers
- Read replica PostgreSQL for analytics queries
- Full observability: APM (Datadog / New Relic), structured logging, distributed tracing
- 99.9% uptime SLA with incident runbooks
- Automated daily DB backups with point-in-time recovery

---

## Phase 3 Deliverables

- Advanced analytics and report export (PDF / CSV)
- Payroll summary and salary slip generation
- AI task prioritisation and performance summaries
- Team calendar with Google / Outlook sync
- Multi-tenant architecture with per-tenant branding
- React Native mobile app (iOS + Android)
- Slack and Microsoft Teams integrations
- SAML / OAuth SSO
- Two-factor authentication
- Full audit logging and GDPR compliance tools
- Employee helpdesk ticketing system
- Public API with webhook support
- CDN + auto-scaling infrastructure

---

## 8. Non-Functional Requirements


| Requirement      | Specification                                                                 |
| ---------------- | ----------------------------------------------------------------------------- |
| Performance      | Page load < 2s; API response < 300ms (p95)                                    |
| Scalability      | Support 10,000+ concurrent users per tenant                                   |
| Security         | OWASP Top 10 mitigated; HTTPS enforced; secrets in environment variables only |
| Accessibility    | WCAG 2.1 AA compliance                                                        |
| Browser Support  | Chrome, Firefox, Safari, Edge (last 2 versions)                               |
| Responsive       | Mobile (≥ 320px), Tablet (≥ 640px), Desktop (≥ 1280px)                        |
| Uptime (Phase 3) | 99.9% SLA                                                                     |
| Localisation     | English (Phase 1–2); multi-language ready architecture (Phase 3)              |
| Data Retention   | Configurable per organisation (Phase 3)                                       |


---

*End of companySYNC PRD v1.0*