# Design System

## Direction

Minimal, cinematic, near-black canvas with one restrained electric-violet
accent. Editorial typography. Avoid: heavy glassmorphism, glowing blobs,
progress-bar skills, card grids for their own sake.

## Tokens

Source of truth: CSS variables in `src/app/globals.css`. Mirrors needed by
TypeScript are in `src/config/theme.ts`; keep them in sync.

| Token             | Value                    | Use                    |
| ----------------- | ------------------------ | ---------------------- |
| `--background`    | `#0a0b0f`                | Page background        |
| `--foreground`    | `#e8e9ee`                | Primary text           |
| `--muted`         | `#9a9db0`                | Secondary text         |
| `--accent`        | `#7c86ff`                | Links, primary actions |
| `--border`        | `rgb(255 255 255 / .08)` | Hairlines              |
| `--border-strong` | `rgb(255 255 255 / .18)` | Outlined buttons       |

Tailwind utilities: `bg-background`, `text-foreground`, `text-muted`,
`text-accent`, `border-border`, `border-border-strong`.

## Typography

- Display / headings: **Instrument Serif** (`font-serif`)
- Body / UI: **Geist Sans** (`font-sans`)
- Labels, tags, numbers: **Geist Mono** (`font-mono`), small uppercase
  eyebrow labels with wide tracking

## Layout

`Container` (`max-w-6xl`, 20px mobile / 32px desktop gutters). Sections
use generous vertical rhythm (`pt-28 sm:pt-40`). Layouts are mobile-first.

## Interaction and accessibility

- Visible `:focus-visible` outline in the accent color.
- Skip link is the first tab stop.
- `prefers-reduced-motion` disables smooth scroll and shortens transitions.
- Hover states change color/border/opacity only; no layout shift.
- Check text contrast whenever you add a new color (not formally audited yet).

## Motion

- **Background:** `NeuralBackground`, a fixed canvas of up to 90 drifting
  particles joined by faint lines, plus lines to the pointer. Tuned in
  `backgroundEffect` (`src/config/theme.ts`). Particle count scales with screen
  area. Pauses when the tab is hidden; draws one static frame under
  `prefers-reduced-motion`. Decorative: `aria-hidden`, `pointer-events: none`.
- **Entrance:** `Reveal` (0.8s fade and 14px rise, staggered by `delay`).
- **Role text:** `RoleRotator` swaps roles every 2.8s; screen readers get the
  full list once; static under reduced motion.
- **Buttons:** color/opacity transitions and a 0.98 press scale.
- **Scroll reveals:** `.scroll-reveal` (project rows) uses CSS
  `animation-timeline: view()`. Browsers without it show the content normally;
  reduced motion disables it. No JavaScript.
- **Navigation:** the link for the section in the middle of the viewport gets an
  accent underline and `aria-current="location"`.
- **Forms:** labelled fields, errors tied to inputs with `aria-describedby`,
  `aria-invalid`, focus moves to the first invalid field, status announced in a
  polite live region. Error text uses red-300 on the dark background.

## Not built yet

Scroll-triggered reveals, active-section highlighting, theme switching (the
site is dark-only by design: `color-scheme: dark`).
