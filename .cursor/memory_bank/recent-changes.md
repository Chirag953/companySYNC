# Recent Changes

Rolling log of the **latest** work. Older entries can be summarized into [progress.md](progress.md) when this file grows.

---

## Current Session (2026-04-25)

**Summary:** Phase 1 Next.js app implemented under `companysync/`: mock auth, all PRD routes, shared UI, dashboards, and production build fix (webpack + no `asChild` on shadcn `Button` / triggers). `docs/phase-1.md` marked complete.

**Last updated:** 2026-04-25

---

## Change List (high level)


| Area                                    | Change type | Description                                                                                                        |
| --------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `companysync/`                          | **Added**   | Full Next.js app: `app/`, `components/`, `lib/`, shadcn UI, auth + mock data                                       |
| `companysync/package.json`              | **Changed** | `dev` / `build` use `--webpack` (Turbopack + WASM-only SWC blocked on this Windows env)                            |
| `companysync/lib/*`                     | **Added**   | `types.ts`, `auth-context.tsx`, `nav-config.ts`, `route-titles.ts`, `utils.ts`, `mock-data/*`                      |
| `companysync/components/*`              | **Added**   | Layout, shared, forms, dashboard, `providers.tsx`, `dashboard-shell.tsx`, `role-gates.tsx`                         |
| `companysync/app/*`                     | **Added**   | Login, forgot-password, dashboard + all feature pages (13 areas)                                                   |
| `companysync/components/`**             | **Changed** | Replaced `Button asChild` / `*Trigger asChild` with `buttonVariants`+`Link` or trigger `className` (Base UI types) |
| `docs/phase-1.md`                       | **Changed** | All Phase 1 checklist items set to **done**; notes on app path and `asChild`                                       |
| `.cursor/memory_bank/progress.md`       | **Changed** | Phase 1 complete, ~33% overall, new work log rows                                                                  |
| `.cursor/memory_bank/recent-changes.md` | **Changed** | This session summary                                                                                               |


---

## Run locally

```bash
cd companysync
npm install
npm run dev
```

**Test logins (mock, password `password`):** `admin@company.com`, `manager@company.com`, `employee@company.com`

---

## Next steps

- Phase 2: PostgreSQL, Prisma, NextAuth, `app/api/`* per `docs/phase-2.md`.

