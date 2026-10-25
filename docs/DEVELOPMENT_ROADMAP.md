# Development Roadmap

**Scope decision:** the portfolio has no activity tracking. The planned GitHub
activity feed and analytics were dropped at Raj's request, so there are 6
phases. The resume download, originally part of that phase, was done in
Phase 1 and 3.

Legend: ✅ done and verified · ⬜ planned. Nothing is marked done unless it
exists and passes the checks listed under its acceptance criteria.

## Phase 1 — Foundation ✅

**Tasks:** initialize project; dependencies; folders; README and docs; types
and centralized data.
**Deliverables:** Next.js app, Zod-validated content layer, hero + projects
list + case-study route, metadata/sitemap/robots, tests, CI file, docs.
**Dependencies:** none.
**Acceptance (all met):** `npm run lint`, `npm run typecheck`,
`npm run format:check`, `npm test` (16 tests), `npm run build`, and
`npm run test:e2e` (12 results across 2 profiles) pass.

## Phase 2 — Visual design ✅

**Tasks:** finalize tokens and type scale; responsive navigation (mobile menu);
interactive neural/particle background (client component, canvas, paused when
off-screen, disabled for reduced motion); hero polish and dynamic role text.
**Deliverables:** `components/animations/`, mobile nav, refined hero.
**Dependencies:** Phase 1.
**Acceptance (met):** checked by screenshot at 360 / 768 / 1280 / 1920 px with no
horizontal scroll (e2e test); background measured at 60fps with no dropped
frames at 390x844 and 1920x1080 in headless Chromium (software-rendered, so
re-check on a real low-end phone in Phase 5); static under
`prefers-reduced-motion`; mobile menu is keyboard-operable (tested).
**Not part of this phase:** type scale and token changes (existing tokens kept),
active-section highlighting (Phase 4 navigation polish).

## Phase 3 — Core portfolio ✅

**Tasks:** About; Skills (grouped, no percentages); richer case-study layout
including `preview` images; GeoVision AI spotlight (implemented vs planned,
only confirmed facts); Experience timeline; Education; Achievements with empty state.
**Deliverables:** section components, enabled in `navigation.ts`, content filled in.
**Dependencies:** Phase 2; Raj supplies verified content (see CONTENT_GUIDE).
**Acceptance (met):** every section renders from data in `src/content` and
`src/config`; empty data shows an empty state or is hidden; each section has
an e2e check; implemented / in-progress / planned status is shown in words and
icons, never color alone. Education is shown inside the About section rather
than as its own section. Case-study pages render `preview` images (covered by a
render test; no screenshots are committed yet).

## Phase 4 — Interactivity ✅

**Delivered:** category filter on the projects list (keyboard accessible, live
count announced); current-section highlight in the desktop navigation
(`aria-current="location"`); scroll-driven reveals in CSS only (no JavaScript,
disabled under reduced motion, content visible in browsers without support);
contact section and form with server-side validation, honeypot, same-origin
check, rate limiting and an honest "not enabled" state.
**Changes from the original plan:** the `motion` package was not needed (CSS
covers the effects), so it and two other unused dependencies were removed;
re-add it if Phase 5 needs richer animation. The site is dark-only by design,
so there is no theme switcher.
**Dependencies:** Phase 3; a mail provider account to enable the form (Resend).
**Acceptance (met):** filters toggle with correct `aria-pressed`; invalid input
is rejected with focus on the first error and nothing is sent; a valid message
reaches the (fake) provider with the right recipient and reply-to; a provider
failure shows an error, keeps the typed text and claims no success; the form is
absent when mail is not configured; foreign origins get 403; header injection
in the name is neutralised.
**Not verified:** delivery through the real Resend service (tested only against
a local stand-in). Do this once when configuring it.

## Phase 5 — Quality assurance ✅

**Done:** axe accessibility audit (zero violations on every page and state
tested); SEO and metadata tests; JSON-LD Person data; generated 1200×630
social image; security headers and Content-Security-Policy; link, keyboard and
console-cleanliness tests; Lighthouse runs; `npm audit` (0 vulnerabilities);
LCP fix (hero name and role line paint immediately). Details and honest limits:
[QUALITY_REPORT.md](QUALITY_REPORT.md).
**Result:** 68 unit tests and 92 e2e tests passing (4 skipped by design).
Lighthouse accessibility, best practices and SEO are 100 everywhere. Performance
is 100 on desktop and 99 on the mobile case study; the mobile home page varies
between 89 and 94 between runs in the simulated-throttling lab test, while the
real-browser LCP measured about 0.3 s.

## Phase 6 — Deployment preparation ✅ / launch ⬜

**Done here:** `npm run readiness` pre-launch report, `.nvmrc`, deployment
guide, a local git repository with the first commit, and the
[HANDBOOK.md](HANDBOOK.md) walkthrough.
**Still yours (could not be done from the build environment):** push to GitHub,
import into Vercel, set environment variables, attach a domain, run the
post-deploy checklist in DEPLOYMENT.md, and test the contact form against real
Resend. Phase 6 is only complete when that checklist is fully ticked.
