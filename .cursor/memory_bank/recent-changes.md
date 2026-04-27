# Recent Changes

**Last session only** (≤15 lines). Older history: [progress.md](progress.md). Protocol: [agents.md](agents.md).

---

## Last session — 2026-04-27 (SocialSYNC theme)

**Brand + glass:** `:root` / `.dark` tokens → emerald/cyan oklch palette (from `socialsync-theme-handoff`), `--brand-start` / `--brand-end`, chart + sidebar aligned. **`Syne`** via `next/font` + `--font-heading`; **`theme-glass`** on `<body>` + `body::before` radial glow (fixed `body.theme-glass::before` selectors). **Utilities:** `.glass`, `.glass-button`, `.futuristic-card`, `.text-gradient`, `.premium-shadow`, `.glass-panel`, neon + `.ss-bell-vibrate`. **Base:** `html` `bg-background`, `body` transparent + scrollbars. Skipped handoff `html { font-size: 80% }` and `.rbc-*`.

Files: `app/globals.css`, `app/layout.tsx`
