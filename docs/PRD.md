# companySYNC — Product Requirements Document (Index)

> **Version:** 1.0  
> **Status:** Draft  
> **Last Updated:** April 2026  
> **Project:** companySYNC — Workforce Management Platform

This document is the **main PRD index**. Detailed phase checklists live in linked files below.

---

## Phase Documents

| Phase | Scope | Document |
| ----- | ----- | -------- |
| **Phase 1** | Next.js TypeScript frontend only (mock data, no real backend) | [phase-1.md](phase-1.md) |
| **Phase 2** | Backend, PostgreSQL, Prisma, NextAuth, API routes, integrations | [phase-2.md](phase-2.md) |
| **Phase 3** | Growth: analytics, payroll, AI, mobile, multi-tenant, enterprise | [phase-3.md](phase-3.md) |

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
| User & Team Management          | Full              | —                 | —                 |
| Leave Policy Configuration      | Full              | —                 | —                 |
| Holiday Calendar Management     | Full              | —                 | —                 |
| Shift Definition & Assignment   | Full              | —                 | —                 |
| Attendance Rule Configuration   | Full              | —                 | —                 |
| Company-wide Analytics          | Full              | —                 | —                 |
| Document Category Management    | Full              | —                 | —                 |
| Document Access — All Employees | View + Download   | —                 | —                 |
| Task Assignment to Team         | —                 | Full              | —                 |
| Leave Approval / Rejection      | —                 | Full              | —                 |
| Team Attendance Monitoring      | —                 | View              | —                 |
| Team Performance Review         | —                 | Full              | —                 |
| Team Document Access            | —                 | View + Download   | —                 |
| Task Management (own)           | —                 | —                 | Full              |
| Leave Application               | —                 | —                 | Full              |
| Attendance Check-in / Check-out | —                 | —                 | Full              |
| View Assigned Shift             | —                 | —                 | View              |
| Own Document Access             | —                 | —                 | View + Download   |
| Personal Notes                  | Yes               | Yes               | Yes               |
| Dashboard (role-specific)       | Yes               | Yes               | Yes               |
| Notifications                   | Yes               | Yes               | Yes               |

---

## 4. Feature Specifications (Summary)

- **User & Team Management (Admin):** CRUD users, departments, teams, assignments
- **Leave:** Policies (admin), approvals (manager), applications (employee)
- **Shift & Attendance:** Templates, rules (admin); team view (manager); check-in/out (employee)
- **Tasks:** Assign and track (manager); own tasks (employee); company-wide read (admin)
- **Performance & Analytics:** Role-scoped dashboards and reports
- **Documents:** Categories, uploads, expiry reminders, role-scoped access
- **Notes:** Private notes for all roles with priority
- **Notifications:** Task, leave, attendance, document, announcements — role-scoped

Full UI and API detail is captured in the phase documents and in [companySYNC_PRD.md](../companySYNC_PRD.md) (monolithic source).

---

## 5. Non-Functional Requirements

| Requirement      | Specification                                                                 |
| ---------------- | ----------------------------------------------------------------------------- |
| Performance      | Page load < 2s; API response < 300ms (p95)                                    |
| Scalability      | Support 10,000+ concurrent users per tenant                                   |
| Security         | OWASP Top 10 mitigated; HTTPS enforced; secrets in environment variables only |
| Accessibility    | WCAG 2.1 AA compliance                                                        |
| Browser Support  | Chrome, Firefox, Safari, Edge (last 2 versions)                             |
| Responsive       | Mobile (≥ 320px), Tablet (≥ 640px), Desktop (≥ 1280px)                      |
| Uptime (Phase 3) | 99.9% SLA                                                                     |
| Localisation     | English (Phase 1–2); multi-language ready architecture (Phase 3)            |
| Data Retention   | Configurable per organisation (Phase 3)                                     |

---

## Related

- Monolithic PRD: [companySYNC_PRD.md](../companySYNC_PRD.md)

*End of PRD index*
