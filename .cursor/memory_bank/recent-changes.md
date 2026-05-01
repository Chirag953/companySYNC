# Recent Changes

**Last session only** (≤15 lines). Older history: [progress.md](progress.md). Protocol: [agents.md](agents.md).

---

## Last session — 2026-04-30 (build: ChartTooltip types)

**What changed:** `npm run build` failed on `ChartTooltip` vs Recharts `Tooltip` `content` prop; fixed by typing props as `TooltipContentProps` + optional `className`, and formatting `value` with `formatTooltipValue`. Build passes.

**Files touched:** `components/shared/ChartTooltip.tsx`, memory bank

**New components added:** none

**Patterns introduced:** none
