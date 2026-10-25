# Changelog

All notable changes are recorded here. Format based on
[Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- Phase 5/6: axe, SEO, link, keyboard, console and security-header e2e tests;
  Person JSON-LD; generated Open Graph/Twitter image; security headers and CSP;
  `resolveSiteUrl` Vercel fallback; `npm run readiness`; `.nvmrc`;
  `docs/QUALITY_REPORT.md` and `docs/HANDBOOK.md`.
- Hero name and role line no longer fade in (they are the largest paint), and
  the role text swaps in place; removed unused dependencies and `loading.tsx`.

- Phase 4: project category filter, current-section navigation highlight,
  CSS scroll-driven reveals, contact section and form (`/api/contact`) with
  validation, honeypot, origin check, rate limiting and a configured-only form.
- E2E: fake mail server, form delivery/failure/validation tests, API security
  tests, and a second server without mail settings to prove the form is hidden.

- Phase 3: GeoVision AI spotlight with per-stage status, About, Skills,
  Experience timeline and Certifications sections; home page renders sections
  from the registry in order; case-study pages show the pipeline and preview
  images; shared `Section` and `StatusBadge` components.
- Component render tests and 8 more e2e checks.

- Phase 2: canvas particle background, rotating hero role text, CSS entrance
  animations, accessible mobile navigation menu.
- `lib/particles.ts` with unit tests; 10 more e2e checks (canvas, overflow,
  role rotation, reduced motion, mobile menu).

- Next.js 16 / TypeScript / Tailwind CSS 4 foundation.
- Zod-validated content layer (`src/config`, `src/content`) and section registry.
- Hero, projects list and `/projects/[slug]` case-study page.
- Metadata, Open Graph, sitemap, robots, error, loading and not-found pages.
- `proxy.ts` so unknown and draft project slugs return a real HTTP 404.
- Vitest unit tests (16) and Playwright e2e tests (6 scenarios, desktop and mobile).
- GitHub Actions CI workflow.
- README, CONTRIBUTING and `docs/` set.

### Changed

- Dropped the planned GitHub activity integration and analytics (no activity
  tracking by design). Roadmap renumbered to six phases.

- Removed the root `loading.tsx`: it forced every page to stream, leaving only
  "Loading…" in the prerendered HTML. The home page now prerenders its full
  content; only the contact section is request-time, behind its own `Suspense`.
- Removed unused dependencies: `motion`, `class-variance-authority`,
  `@fontsource/instrument-serif`.

- Added the Aug 2026 resume as `public/resume/Raj_Konde_Resume.pdf`; the Resume
  button now appears. Education supports a free-text `grade` (CGPA 8.86).

- Filled in content from Raj's notes and resumes: four published projects, skills,
  experience and leadership, education, certifications.
- Projects can now list `features.inProgress` and `limitations`; case-study
  pages render them as "In progress" and "Current limitations".
- Experience `type` accepts `development`.

- `typecheck` script now runs `next typegen` first so route types exist.
- Vitest config renamed to `vitest.config.mts` (removes a module-type warning).
