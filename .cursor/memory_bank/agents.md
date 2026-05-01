# Agent registry & memory bank protocol

---

## Registered agents

### Aby — UI / UX / design


| Field            | Value                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| Rule file        | `.cursor/rules/aby.mdc`                                                    |
| Activation       | User writes **Aby** in chat (case-insensitive)                             |
| Owns             | `app/**/*.tsx` (UI), `components/`** except `components/ui` refactors      |
| Does **not** own | Backend, `app/api/`**, DB, auth wiring, `lib/mock-data/`**, `lib/types.ts` |
| Dependencies     | No new npm packages without explicit user approval                         |


### Dextor — Full-stack / Phase 2 backend


| Field            | Value                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Rule file        | `.cursor/rules/dextor.mdc`                                                                                                                   |
| Skill            | `.cursor/skills/dextor/SKILL.md`                                                                                                               |
| Activation       | User writes **Dextor** in chat (case-insensitive)                                                                                                |
| Owns             | `app/api/**`, `lib/prisma.ts`, `lib/auth.ts`, `middleware.ts`, `prisma/**`, server-only `lib/**` for backend |
| Does **not** own | UI-only work (Aby); casual refactors of `components/ui/**` |
| Dependencies     | No new npm packages without explicit user approval                                                                                             |


Registered personas: **Aby** (UI/UX), **Dextor** (full-stack / Phase 2). Add a subsection here when introducing a new `.cursor/rules/*.mdc` agent.

---

## Memory bank — after every agent session

1. `**recent-changes.md**` — **Replace** entire file with **last session only** (title + ≤15 lines body). No rolling multi-session history here.
2. `**progress.md`** — **Append** one new row at the **top** of the Work Log table: `Date | Phase | Area | What was done | Files/notes` (keep Files/notes ≤40 characters when possible).
3. `**architecture.md`** — If you added a **new** layout / shared / dashboard / form component, **append one row** to the correct table in this file.
4. `**project.md`** — Edit only when stack, routes, or global constraints change.
5. `**agents.md`** — Edit only when adding/changing an agent definition.

---

## Read order (token-efficient)

1. `recent-changes.md` — what changed last time
2. `architecture.md` — where code lives + patterns
3. `project.md` — only if you need routes, stack, roles, dev commands
4. `progress.md` — only if you need older history than `recent-changes.md`
5. `agents.md` — only if updating registry or protocol text

Full product docs remain in `docs/` for deep dives; do not duplicate them into the memory bank.