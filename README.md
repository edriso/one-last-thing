# One Last Thing

A **frontend-only** 3-minute "close the day" ritual — a gentler ending than
doomscrolling in bed. Three quiet steps: **tidy one surface**, set **tomorrow's
single intention**, then **lights out**. No backend, no accounts, works offline.

## The flow

`intro → tidy → intention → done`

- **Tidy one surface** — a single short countdown (default 60s; "done early" is
  always allowed). Just one surface: the nightstand, the desk, the counter.
- **Tomorrow, one thing** — one line, not a list: the single thing that would
  make tomorrow feel good. It's saved for the day.
- **That's everything** — "Lights out. Phone down. Goodnight."

## Tech

React 19 + TypeScript (strict), Vite, Tailwind v4, Zustand, Zod-validated
localStorage, PWA. Tested with Vitest + Testing Library and Playwright.

## Commands

```bash
pnpm install
pnpm dev          # vite dev server
pnpm build        # type-check + production build
pnpm lint         # eslint, zero warnings
pnpm test         # vitest (unit + component)
pnpm test:e2e     # playwright
```

## Notes

- The intention is saved per day to localStorage (parsed with Zod; safe
  defaults on old or corrupt data). Settings (tidy time, accent) live there too.
- Entrances animate transform only and keep `opacity: 1`, so the first screen is
  never stuck invisible. Reduced motion is honored.

## License

MIT.
