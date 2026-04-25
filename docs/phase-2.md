# Phase 2 — Backend + Real Authentication

> **Goal:** Production APIs in the **same Next.js monorepo** via App Router Route Handlers (`app/api/**/route.ts`). PostgreSQL + Prisma. Replace mocks with real data. NextAuth.js v5.

**Legend:** `✅` done · `❌` not done

---

## Tech Stack

| Layer                   | Technology                                                   | Status |
| ----------------------- | ------------------------------------------------------------ | ------ |
| API Layer               | Next.js Route Handlers (`app/api/**/route.ts`)              | ❌     |
| Database                | PostgreSQL                                                   | ❌     |
| ORM                     | Prisma                                                       | ❌     |
| Authentication          | NextAuth.js v5 (Credentials + JWT)                           | ❌     |
| Password Hashing        | bcrypt (salt rounds = 12)                                    | ❌     |
| File Storage            | AWS S3 or Cloudflare R2                                      | ❌     |
| Real-Time Notifications | Pusher or Ably                                               | ❌     |
| Validation              | Zod (shared client + API)                                    | ❌     |
| Middleware              | `middleware.ts` — auth + role enforcement                    | ❌     |
| Testing                 | Vitest + Playwright                                          | ❌     |
| Containerisation        | Docker Compose (PostgreSQL)                                  | ❌     |

---

## Database

- ❌ `prisma/schema.prisma` with all models (User, Department, Team, Task, Subtask, TaskComment, TaskAttachment, TaskHistory, LeaveType, LeaveBalance, LeaveRequest, Holiday, Shift, ShiftAssignment, Attendance, AttendanceRule, DocumentCategory, Document, Note, Notification, PasswordReset)
- ❌ Enums: Role, Priority, TaskStatus, LeaveStatus, AttendanceStatus
- ❌ `lib/prisma.ts` — Prisma client singleton
- ❌ Docker Compose for local PostgreSQL
- ❌ Run migrations and verify schema

---

## Authentication & Security

- ❌ `lib/auth.ts` — NextAuth v5: CredentialsProvider, JWT session, callbacks (`authorize`, `jwt`, `session`)
- ❌ Session payload: `id`, `email`, `role`, `name` on token/session
- ❌ Passwords never returned in API responses (`passwordHash` excluded)
- ❌ `POST /api/auth/forgot-password` — token (hashed), 15-min expiry, Resend email
- ❌ `POST /api/auth/reset-password` — validate token, update password, invalidate token
- ❌ `middleware.ts` — public `/login`; protect `/dashboard/*`; API role rules; cron secret for `/api/cron/*`

---

## API Route Handlers

### Auth

- ❌ `GET/POST /api/auth/[...nextauth]`
- ❌ Forgot / reset password routes (as above)

### Users

- ❌ `GET/POST /api/users`
- ❌ `GET/PUT/DELETE /api/users/[id]`
- ❌ `PATCH /api/users/[id]/status`

### Teams

- ❌ `GET/POST /api/teams`
- ❌ `GET/PUT/DELETE /api/teams/[id]`
- ❌ `POST /api/teams/[id]/members`
- ❌ `DELETE /api/teams/[id]/members/[userId]`

### Tasks

- ❌ `GET/POST /api/tasks`
- ❌ `GET/PUT/DELETE /api/tasks/[id]`
- ❌ `PATCH /api/tasks/[id]/status` (+ history + Pusher where specified)
- ❌ Subtasks, comments, attachments, history sub-routes

### Leave

- ❌ Leave types CRUD
- ❌ Leave balance endpoints
- ❌ Leave requests (apply, list, get, approve/reject PATCH)
- ❌ Holidays CRUD

### Attendance

- ❌ `POST /api/attendance/checkin`, `checkout`
- ❌ `GET /api/attendance/today`, paginated history, team, all, rules GET/PUT

### Shifts

- ❌ Shifts CRUD, assign, `GET /api/shifts/my`

### Performance

- ❌ `GET /api/performance`, `/team`, `/company` (computed from tasks + attendance)

### Documents

- ❌ Role-scoped list, multipart upload, metadata, delete (admin)
- ❌ Categories CRUD

### Notes

- ❌ `GET/POST /api/notes`, `PUT/DELETE /api/notes/[id]` (own only)

### Notifications

- ❌ List, mark one read, mark all read, delete

### Cron (`CRON_SECRET`)

- ❌ `GET /api/cron/attendance-reminder`
- ❌ `GET /api/cron/document-expiry`
- ❌ `GET /api/cron/leave-balance-reset`
- ❌ `GET /api/cron/overdue-tasks`
- ❌ `vercel.json` cron schedules

---

## Integrations & Infrastructure

- ❌ `lib/pusher.ts` — server trigger; client subscribe per user channel
- ❌ `lib/s3.ts` (or R2) — upload via Route Handlers; pre-signed download URLs
- ❌ `lib/resend.ts` — transactional email
- ❌ `lib/cron-secret.ts` — validate cron requests
- ❌ Environment variables documented and `.env.example` (DATABASE_URL, NEXTAUTH_*, AWS_*, PUSHER_*, RESEND_*, CRON_SECRET)

---

## Frontend Migration (from Phase 1)

- ❌ Replace mock auth with NextAuth `useSession` / server session helpers
- ❌ Replace mock data fetches with `fetch()` to Route Handlers across all pages
- ❌ Align Zod schemas shared between forms and APIs

---

## Testing

- ❌ Vitest — leave balance calculation, attendance status rules, critical business logic
- ❌ Playwright — login, check-in/out, task status update, leave apply → approve flow

---

## Phase 2 Deliverables (checklist)

- ❌ Prisma schema + migrations applied
- ❌ NextAuth v5 + bcrypt + JWT
- ❌ `middleware.ts` edge auth + roles
- ❌ All Route Handlers implemented and role-scoped
- ❌ Forgot / reset password + Resend
- ❌ S3/R2 uploads + pre-signed downloads
- ❌ Pusher real-time notifications
- ❌ Vercel crons configured
- ❌ Docker Compose for local Postgres
- ❌ Zod on every Route Handler input
- ❌ Vitest + Playwright suites in place

---

[Back to PRD index](PRD.md) · [Phase 1 — Frontend](phase-1.md) · [Phase 3 — Growth](phase-3.md)
