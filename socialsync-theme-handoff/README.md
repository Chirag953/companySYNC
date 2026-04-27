# SocialSYNC Theme Handoff

Use this folder to copy the SocialSYNC global theme into another Tailwind/Next.js project.

## Files

- `globals.css` - main theme variables, base styles, glass utilities, shadows, scrollbars, and calendar styles.
- `tailwind.config.ts` - Tailwind color tokens, fonts, radii, shadows, animations, and plugin setup.
- `postcss.config.mjs` - basic Tailwind PostCSS config.
- `package-dependencies.json` - packages needed for the theme setup.
- `layout-example.tsx` - example Next.js root layout showing the required font variables and theme classes.

## Install Packages

```bash
npm install tailwindcss-animate next-themes
npm install -D tailwindcss postcss
```

If the project already has Tailwind installed, only make sure `tailwindcss-animate` is installed.

## Setup Steps

1. Copy `globals.css` into the target project, usually `src/styles/globals.css` or `src/app/globals.css`.
2. Import it from the root layout:

```tsx
import "../styles/globals.css";
```

3. Copy the `theme.extend` values and `plugins` from `tailwind.config.ts` into the target project's Tailwind config.
4. Add these body classes in the root layout:

```tsx
className={`${inter.variable} ${syne.variable} theme-glass font-sans antialiased`}
```

5. Add the Inter and Syne font setup from `layout-example.tsx`, or replace them with the target project's preferred fonts.
6. If the project uses dark mode, keep Tailwind configured with:

```ts
darkMode: ["class"]
```

## Main Theme Classes

- `theme-glass` - enables the background glow effect.
- `glass` - translucent glass card/panel.
- `glass-button` - glass button styling.
- `futuristic-card` - rounded card with border, blur, and premium shadow.
- `text-gradient` - emerald-to-cyan gradient text.
- `premium-shadow` - shared elevated shadow.
- `glass-panel` - darker glass surface.
- `neon-border`, `neon-text-blue`, `neon-text-green` - futuristic accent effects.

## Brand Colors

- Brand start: `#10b981`
- Brand end: `#06b6d4`
- Primary HSL token: `174.7 84% 41%`
- Secondary HSL token: `199 89% 48%`

