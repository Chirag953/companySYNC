# companySYNC — Project facts (static)

Condensed for agents. Full PRD: `docs/PRD.md`. Phase checklist: `docs/phase-1.md`.

---

## Stack


| Layer       | Technology                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router), `next dev/build --webpack` (Windows SWC policy)                                                                    |
| Language    | TypeScript strict                                                                                                                           |
| Styling     | Tailwind CSS v4, tokens in `app/globals.css` (no `tailwind.config.js`)                                                                      |
| Typography  | **Inter** (UI) + **JetBrains Mono** (mono) + **Syne** (`--font-heading` / optional `--font-display` alias), `next/font` in `app/layout.tsx` |
| UI          | shadcn / Base UI under `components/ui/`                                                                                                     |
| Auth (mock) | `lib/auth-context.tsx` + `Providers`                                                                                                        |
| Forms       | React Hook Form + Zod                                                                                                                       |
| Tables      | TanStack Table                                                                                                                              |
| Charts      | Recharts                                                                                                                                    |
| Toasts      | Sonner + `next-themes`                                                                                                                      |
| Icons       | `lucide-react` only                                                                                                                         |
| Dates       | `date-fns` v4                                                                                                                               |


---

## Routes (Phase 1)


| Path                         | Notes                                                                  |
| ---------------------------- | ---------------------------------------------------------------------- |
| `/`                          | Redirects to `/login`                                                  |
| `/login`, `/forgot-password` | Auth                                                                   |
| `/dashboard`                 | Role dashboards                                                        |
| `/users`, `/users/[id]`      | Admin (`RequireRole`); `/users` = stacked role cards + tables per role |
| `/teams`                     | Admin                                                                  |
| `/tasks`, `/tasks/[id]`      | All roles                                                              |
| `/leave`                     | Admin + employee                                                       |
| `/leave/requests`            | Manager                                                                |
| `/attendance`                | All roles                                                              |
| `/shifts`                    | Admin + employee                                                       |
| `/performance`               | All roles                                                              |
| `/documents`                 | All roles                                                              |
| `/documents/categories`      | Admin                                                                  |
| `/notes`, `/settings`        | All roles                                                              |
| `/audit-log`                 | Admin & manager only; scoped mock trail                                |
| `/notifications`             | Bell → **View all** (not in sidebar)                                   |


Nav source: `lib/nav-config.ts` (`getNavSections`, `flattenNavItems`). Titles: `lib/route-titles.ts`.

---

## Roles (summary)


| Role         | Scope                                                        |
| ------------ | ------------------------------------------------------------ |
| **admin**    | Users, teams, doc categories, shifts write, company settings |
| **manager**  | Leave approvals, team views                                  |
| **employee** | Own tasks, leave apply, attendance, read shifts              |


---

## Dev commands

Repo root (`companySYNC`):

```bash
npm install
npm run dev
```

**Mock logins** (password `password`): `admin@company.com`, `manager@company.com`, `employee@company.com`

---

## Hard constraints (UI agents)

- Do **not** use `asChild` on `Button` — use `buttonVariants` + `next/link` `Link`.
- Recharts: `stroke` / `fill` = `var(--primary)` or `var(--chart-1)` … `var(--chart-5)` — never `hsl(var(--primary))` (tokens are oklch).
- New surfaces: `dark:` parity + semantic tokens (`bg-background`, `text-foreground`, etc.).
- Do **not** edit `lib/mock-data/`* or `lib/types.ts` without explicit request.
- No new npm dependencies without explicit approval.

