# Raj Konde Portfolio — Handbook

The single guide to everything: how to run the site, what every file does,
what you still need to add, and how to put it online. Read top to bottom once;
afterwards use the table of contents.

1. [What this project is](#1-what-this-project-is)
2. [Run it on your computer](#2-run-it-on-your-computer)
3. [All commands](#3-all-commands)
4. [Environment variables](#4-environment-variables)
5. [File-by-file map](#5-file-by-file-map)
6. [How to change things](#6-how-to-change-things)
7. [What is left for you (checklist)](#7-what-is-left-for-you)
8. [Deploy step by step](#8-deploy-step-by-step)
9. [Tests and quality results](#9-tests-and-quality-results)
10. [Troubleshooting](#10-troubleshooting)
11. [Honest limits](#11-honest-limits)

---

## 1. What this project is

A single-page portfolio for Raj Konde (AI/ML engineer, final-year B.Tech CSE)
plus one case-study page per project (`/projects/<slug>`).

- Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **All text lives in data files** (`src/config`, `src/content`). You rarely
  touch components. A schema (Zod) rejects mistakes when you build.
- Honest by design: every project and every pipeline stage has a status
  (`implemented`, `in-progress`, `planned`). Nothing is invented: no fake
  numbers, testimonials or activity feeds. You chose **no activity tracking**
  (no GitHub feed, no analytics), so none exists.
- Works with zero configuration. The contact form appears only when all
  three mail settings exist; otherwise the page shows email/social links.

Implemented: hero with rotating role, project list with filter, case-study
pages, GeoVision spotlight with per-stage status, About, Skills, Experience,
Credentials, Contact (form + API), particle background, accessible navigation
with current-section highlight, SEO (metadata, sitemap, robots, JSON-LD,
generated social image), security headers.

Not built (on purpose or not yet): blog, analytics, GitHub activity,
testimonials, dark/light toggle (the site is dark only), a CMS.

## 2. Run it on your computer

Prerequisite: **Node.js 22** (20.9 or newer also works). Check with
`node -v`. Get it from nodejs.org, or with nvm: `nvm install` (reads `.nvmrc`).

1. Unzip `raj-portfolio.zip`; open a terminal in the `raj-portfolio` folder.
   - Windows: open the folder in File Explorer, click the address bar, type
     `cmd`, press Enter. Or use VS Code's terminal (Ctrl+`).
   - Mac/Linux: `cd path/to/raj-portfolio`.
2. `npm install` (first time only, 1–3 minutes).
3. `npm run dev`
4. Open http://localhost:3000. Edits to files refresh the page automatically.
5. Stop with Ctrl+C.

Optional: copy `.env.example` to `.env.local` and fill values (section 4).
On Windows: `copy .env.example .env.local`. Mac/Linux: `cp .env.example .env.local`.
Restart `npm run dev` after changing it.

To see the real production version: `npm run build` then `npm start`.

## 3. All commands

| Command                | What it does                                                                |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run dev`          | Development server on port 3000, live reload.                               |
| `npm run build`        | Production build. Also validates all content with Zod; fails on mistakes.   |
| `npm start`            | Serves the production build (run `build` first).                            |
| `npm run lint`         | ESLint code-quality check.                                                  |
| `npm run typecheck`    | Generates route types, then TypeScript with no emit.                        |
| `npm run format`       | Prettier rewrites files into the standard style.                            |
| `npm run format:check` | Prettier only checks.                                                       |
| `npm test`             | Unit tests (Vitest), about 2 seconds.                                       |
| `npm run test:watch`   | Unit tests that re-run on save.                                             |
| `npm run test:e2e`     | Browser tests (Playwright). First run: `npx playwright install chromium`.   |
| `npm run check`        | lint + typecheck + format check + unit tests in one go. Run before pushing. |
| `npm run readiness`    | Pre-launch report: leftover TODOs, missing links, placeholder text, etc.    |

## 4. Environment variables

All optional. Local: `.env.local` (never committed). Production: Vercel
dashboard → Project → Settings → Environment Variables.

| Variable                      | Meaning                                                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`        | Your public address, e.g. `https://rajkonde.dev`. Used in canonical URLs, social previews, sitemap. If unset on Vercel, the Vercel production domain is used automatically; locally it is `http://localhost:3000`. |
| `NEXT_PUBLIC_CONTACT_EMAIL`   | Email shown on the site. Public (visible to everyone). Leave empty to hide.                                                                                                                                        |
| `RESEND_API_KEY`              | Secret key from resend.com/api-keys. Server only.                                                                                                                                                                  |
| `CONTACT_TO_EMAIL`            | Inbox that receives messages.                                                                                                                                                                                      |
| `CONTACT_FROM_EMAIL`          | Sender, e.g. `Portfolio <onboarding@resend.dev>` (test) or an address on your verified domain.                                                                                                                     |
| `CONTACT_RATE_LIMIT_PER_HOUR` | Messages per visitor per hour. Default 5.                                                                                                                                                                          |

The form is enabled only if the last three of the first five rows
(`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) are all set.
Never put a secret in a variable starting with `NEXT_PUBLIC_`; those are
shipped to every visitor's browser.

## 5. File-by-file map

### Root

| File                                  | Contains                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `package.json`                        | Dependencies and every `npm run` command; Node version requirement.                                                                                    |
| `package-lock.json`                   | Exact dependency versions. Commit it; never edit by hand.                                                                                              |
| `.nvmrc`                              | Node version (22) for nvm and many hosts.                                                                                                              |
| `next.config.ts`                      | Next.js settings: Cache Components, security headers, Content-Security-Policy, hides `X-Powered-By`.                                                   |
| `tsconfig.json`                       | TypeScript settings and the `@/` alias for `src/`.                                                                                                     |
| `eslint.config.mjs`                   | Lint rules.                                                                                                                                            |
| `.prettierrc.json`, `.prettierignore` | Formatting rules and ignored files (includes the Tailwind class sorter).                                                                               |
| `vitest.config.mts`                   | Unit-test setup (picks `tests/unit/**`).                                                                                                               |
| `playwright.config.ts`                | Browser-test setup: desktop, mobile (Pixel 7), and a no-mail server project; starts a fake mail server and two site servers on ports 4010, 3100, 3101. |
| `.env.example`                        | Documented template for environment variables.                                                                                                         |
| `.gitignore`                          | Keeps `node_modules`, `.next`, `.env*` (except the example), test output out of git.                                                                   |
| `.github/workflows/ci.yml`            | GitHub Actions: lint, typecheck, format check, unit tests, build, e2e on each push/PR. Never yet run on GitHub.                                        |
| `AGENTS.md`                           | Auto-generated by Next.js for AI coding tools. Safe to leave.                                                                                          |
| `next-env.d.ts`                       | Auto-generated Next types. Do not edit.                                                                                                                |
| `LICENSE`                             | Licence text.                                                                                                                                          |
| `README.md`                           | Short overview and quick start.                                                                                                                        |
| `CONTRIBUTING.md`                     | Workflow rules for changing the project.                                                                                                               |
| `CHANGELOG.md`                        | What changed in each phase.                                                                                                                            |

### `docs/`

| File                     | Contains                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `HANDBOOK.md`            | This file.                                                                         |
| `PROJECT_OVERVIEW.md`    | Goals, audience, principles, scope.                                                |
| `ARCHITECTURE.md`        | How the code is organised and why (server components, registry, Cache Components). |
| `DESIGN_SYSTEM.md`       | Colours, fonts, spacing, motion rules.                                             |
| `CONTENT_GUIDE.md`       | How to write and edit each content file safely.                                    |
| `DEVELOPMENT_ROADMAP.md` | The 6 phases and their real status.                                                |
| `DEPLOYMENT.md`          | Hosting notes and the post-deploy checklist.                                       |
| `TESTING.md`             | Test strategy and how to run each suite.                                           |
| `QUALITY_REPORT.md`      | Measured accessibility/Lighthouse/security results and limits.                     |

### `scripts/`

`readiness.mjs` — read-only checker behind `npm run readiness`. Exit code 1
only if a blocker exists.

### `public/` (served as-is at the site root)

| Path                          | Contains                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| `resume/Raj_Konde_Resume.pdf` | The file the Resume button downloads (`/resume/Raj_Konde_Resume.pdf`). Replace it, keeping the name. |
| `resume/README.md`            | Note about the resume file.                                                                          |
| `images/profile/`             | Put a profile photo here (optional). README inside.                                                  |
| `images/projects/`            | Put project screenshots here (optional). README inside.                                              |
| `icons/`                      | Extra icons (optional). README inside.                                                               |

### `src/config/` — site-wide settings

| File            | Contains                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.ts`       | Name, title, description, location, rotating roles, headline, summary, focus areas, About paragraphs, GitHub/LinkedIn links, resume path, copyright year. |
| `navigation.ts` | Section list: order, label, anchor, `enabled`. Home page order and nav follow it.                                                                         |
| `theme.ts`      | Background and accent colour, and particle-background settings.                                                                                           |

### `src/content/` — your data

| File              | Contains                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `projects.ts`     | GeoVision AI, TrustChain AI, AquaMind, Regional Slang Recognition: summary, status, tags, pipeline stages, limitations, links, visibility. |
| `skills.ts`       | Skill groups by name (no percentages). "Exploring" group is separate on purpose.                                                           |
| `experience.ts`   | Nine roles (internships, development, leadership) newest first.                                                                            |
| `education.ts`    | B.Tech at Pimpri Chinchwad University, expected June 2027, CGPA 8.86.                                                                      |
| `achievements.ts` | Four certifications (Google, AWS Academy, IBM, Coursera).                                                                                  |

### `src/types/` and `src/lib/` — logic

| File                         | Contains                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `types/content.ts`           | TypeScript types for all content (inferred from the schemas).                                                                   |
| `lib/validations/content.ts` | Zod schemas; build fails if content breaks them.                                                                                |
| `lib/validations/contact.ts` | Rules for the contact form fields.                                                                                              |
| `lib/content.ts`             | Helpers: published projects, featured project, find by slug, visible skills, categories.                                        |
| `lib/format.ts`              | Month/range formatting ("May 2026 – Aug 2026").                                                                                 |
| `lib/particles.ts`           | Pure particle-simulation maths for the background.                                                                              |
| `lib/seo.ts`                 | Page metadata builder, Person JSON-LD, safe JSON-LD serializer.                                                                 |
| `lib/site-url.ts`            | Decides the public site URL (env → Vercel → localhost).                                                                         |
| `lib/social-image.tsx`       | Draws the 1200×630 share image.                                                                                                 |
| `lib/resume.ts`              | Whether the resume file exists (hides the button if not).                                                                       |
| `lib/contact-config.ts`      | Is mail configured? (all three variables present).                                                                              |
| `lib/contact-handler.ts`     | Whole contact pipeline: config → same-origin → size → rate limit → JSON → validation → honeypot → send via Resend with timeout. |
| `lib/rate-limit.ts`          | In-memory per-visitor limiter.                                                                                                  |
| `lib/utils.ts`               | Small helpers (class-name joining).                                                                                             |

### `src/app/` — pages and routes

| File                                       | Contains                                                         |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `layout.tsx`                               | Fonts, background canvas, skip link, header, footer, page shell. |
| `page.tsx`                                 | Home page: JSON-LD plus sections in registry order.              |
| `projects/[slug]/page.tsx`                 | Case-study page; unknown/draft slugs 404.                        |
| `api/contact/route.ts`                     | POST endpoint for the form.                                      |
| `opengraph-image.tsx`, `twitter-image.tsx` | Social preview images.                                           |
| `sitemap.ts`, `robots.ts`                  | `/sitemap.xml`, `/robots.txt`.                                   |
| `error.tsx`, `not-found.tsx`               | Error and 404 pages.                                             |
| `globals.css`                              | Design tokens, entrance/scroll animations, reduced-motion rules. |
| `favicon.ico`                              | Browser tab icon.                                                |
| `../proxy.ts`                              | Makes unknown project URLs return a real 404 (not 200).          |
| `../fonts/`                                | Self-hosted Instrument Serif font files.                         |

### `src/components/`

| Folder / file                                                                                             | Contains                                                                                                     |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `animations/neural-background.tsx`                                                                        | Canvas particle background (paused when hidden, still with reduced motion).                                  |
| `animations/reveal.tsx`                                                                                   | Entrance animation wrapper.                                                                                  |
| `hero/role-rotator.tsx`                                                                                   | Swapping role text, exposes all roles to screen readers.                                                     |
| `layout/site-header.tsx`, `desktop-nav.tsx`, `mobile-nav.tsx`, `use-active-section.ts`, `site-footer.tsx` | Header, navigation, mobile menu, scroll-spy hook, footer.                                                    |
| `sections/hero.tsx` … `contact.tsx`                                                                       | One file per home-page section: hero, geovision-spotlight, about, skills, experience, achievements, contact. |
| `projects/`                                                                                               | `projects-section` (list + filter), `project-list`, `project-case-study`, `pipeline-flow`.                   |
| `contact/contact-panel.tsx`, `contact-form.tsx`                                                           | Chooses form vs. links; the form itself.                                                                     |
| `shared/`                                                                                                 | `container`, `section`, `section-heading`, `status-badge`.                                                   |

### `tests/`

| File                                                  | Covers                                                                |
| ----------------------------------------------------- | --------------------------------------------------------------------- |
| `unit/content.test.ts`                                | Content passes schemas; honesty rules (e.g. no invented percentages). |
| `unit/lib.test.ts`                                    | seo, site-url helpers.                                                |
| `unit/format.test.ts`, `particles.test.ts`            | Date formatting; particle maths.                                      |
| `unit/components.test.tsx`, `contact-ui.test.tsx`     | Component rendering and form behaviour.                               |
| `unit/contact.test.ts`                                | Contact handler: every rejection path and success.                    |
| `unit/readiness.test.ts`                              | Readiness script, site URL fallback, JSON-LD.                         |
| `e2e/site.spec.ts`                                    | Whole-site behaviour in a real browser.                               |
| `e2e/contact.spec.ts`, `contact-unconfigured.spec.ts` | Form with fake mail server; site without mail settings.               |
| `e2e/quality.spec.ts`                                 | axe accessibility, SEO, links, keyboard, console, headers.            |
| `e2e/fake-resend.mjs`                                 | Stand-in mail server for tests.                                       |

## 6. How to change things

After any edit: check the browser, then run `npm run check`. `npm run build`
validates content and stops with a clear message if a field is wrong.

### Name, headline, roles, About, links — `src/config/site.ts`

Edit the strings. `roles` is the rotating text (keep 1–3). `social.github` and
`social.linkedin` are the full URLs. Add more links only if the type allows
(see `SiteConfig` in `src/types/content.ts`).

### Hide or reorder sections — `src/config/navigation.ts`

Set `enabled: false` to hide; reorder the array to reorder the page and nav.

### Add or finish a project — `src/content/projects.ts`

Find the project and fill the open fields:

```ts
contribution: "What I personally built: <only things you did>.",
links: {
  repository: "https://github.com/Rajkonde4/<repo>",
  demo: "https://<hosted-demo>",   // only if it is really live
},
```

To add a new project, copy an existing object, give it a unique lowercase
`slug`, and set `visibility: "published"` (use `"draft"` to keep it hidden).
`status` is `implemented`, `in-progress` or `planned`; be truthful. Remove the
matching `TODO(Raj)` comment when done.

Pipeline stages (GeoVision) have their own `status` each; change a stage to
`implemented` only when it genuinely works.

### Skills — `src/content/skills.ts`

Add a name string to a group's `items`. No percentages. Put things you are
still learning in the "exploring" group.

### Experience — `src/content/experience.ts`

Copy an entry; use `start`/`end` as `"YYYY-MM"`. Leave out dates you are
unsure of rather than guessing (EventSphere has no start month; TEDxPCU
mentoring has no dates). Add `highlights` as short factual bullets.

### Education and certifications — `education.ts`, `achievements.ts`

Add only items you can prove. Add `url` for a credential link if you have one.
Graduation shows "expected" while `graduation: "expected"`; change it when you
graduate.

### Resume

Replace `public/resume/Raj_Konde_Resume.pdf` with the new file (same name).
The PDF currently includes your phone number and email, which become public.
Export a version without them if you prefer.

### Photos and screenshots

Put files in `public/images/profile` or `public/images/projects`, then add
to the project a `preview: { src: "/images/projects/<file>.png", alt: "…" }`
(see `CONTENT_GUIDE.md`). Always give meaningful alt text.

### Colours, particles — `src/config/theme.ts`, `src/app/globals.css`

Change `accent`/`background` hex values; particle count/distance settings are
in the same file. Fonts are loaded in `src/app/layout.tsx`.

### Contact form

1. Create a Resend account, make an API key.
2. For testing, `CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>` only
   delivers to your own Resend account email. For real use, verify a domain.
3. Set the three variables (local `.env.local` or Vercel).
4. Send a real test message and check that it arrives. This has never been
   tested against real Resend.

## 7. What is left for you

Run `npm run readiness` for a live version of this list.

Content you must supply or confirm:

- [ ] `contribution` for GeoVision AI, TrustChain AI, AquaMind, Regional Slang (what _you_ built, after checking repos).
- [ ] `links.repository` (and `demo` if hosted) for each project.
- [ ] AquaMind: the earlier "32% / 18%" figures were left out deliberately. Add them only with an explanation of how they were measured.
- [ ] TEDxPCU mentoring: dates and what it involved.
- [ ] EventSphere: start month.
- [ ] Regional Slang Recognition: supported languages and any evaluation results.
- [ ] Optional: profile photo, screenshots, certificate URLs.
- [ ] Decide whether to show a public email (`NEXT_PUBLIC_CONTACT_EMAIL`).
- [ ] Decide whether the resume PDF should keep phone/email.

Launch steps only you can do (not possible from the build environment):

- [ ] Push the code to GitHub.
- [ ] Deploy to Vercel and set environment variables.
- [ ] Attach a custom domain (optional) and set `NEXT_PUBLIC_SITE_URL`.
- [ ] Test the contact form with real Resend.
- [ ] Open the live site on a real phone; run PageSpeed Insights on the live URL.
- [ ] Share the URL in a chat to check the preview image.
- [ ] Update GitHub and LinkedIn profiles with the link.

## 8. Deploy step by step

A local git repository with the first commit is included in the zip.

1. **Final local check:** `npm run readiness`, `npm run check`, `npm run build`.
2. **Create a GitHub repo:** github.com → New → name e.g. `raj-portfolio`,
   no README/licence/gitignore (the project already has them).
3. **Push:**
   ```
   git remote add origin https://github.com/Rajkonde4/raj-portfolio.git
   git push -u origin main
   ```
   (If you unzipped without the hidden `.git` folder, run `git init -b main`,
   `git add .`, `git commit -m "Initial portfolio"` first.)
   Check on GitHub that `.env.local` is **not** there.
4. **Import to Vercel:** vercel.com → Add New → Project → pick the repo.
   Framework "Next.js" is detected; change nothing.
5. **Environment variables** (before the first deploy): add the ones you want
   from section 4. Mark the Resend key Sensitive.
6. **Deploy.** Open the `*.vercel.app` address.
7. **Domain (optional):** Project → Settings → Domains → add, follow the DNS
   instructions, then set `NEXT_PUBLIC_SITE_URL` to `https://your-domain` and
   redeploy.
8. **Post-deploy checklist:** tick every item in `docs/DEPLOYMENT.md`.
9. **GitHub Actions:** the first push triggers CI. If it fails, read the log;
   the usual cause is the e2e job needing browsers (the workflow installs them).

Any other Node host works: `npm ci && npm run build && npm start`. A static
export is not supported.

## 9. Tests and quality results

Latest measured: 68 unit tests and 92 browser tests pass (4 skipped by design);
axe finds 0 violations on all tested pages; `npm audit` reports 0
vulnerabilities; Lighthouse on a local production build: 100/100/100/100 on
desktop and a mobile case study (99 perf), mobile home 89–94 performance with
100 in the other three. Full detail and limits are in `QUALITY_REPORT.md`.

## 10. Troubleshooting

| Symptom                                         | Fix                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `npm install` fails with engine/version message | Install Node 22 (`nvm use`).                                                    |
| Port 3000 busy                                  | `npm run dev -- --port 3001`.                                                   |
| Build fails with a Zod message                  | It names the content field; fix it in `src/content`/`src/config`.               |
| Contact form not showing                        | One of the three mail variables is missing; restart after editing `.env.local`. |
| Form shows an error on send                     | Check the Resend key, the sender address (must be verified), and Vercel logs.   |
| Social preview shows old image                  | Platforms cache; use their re-scrape tools (LinkedIn Post Inspector, etc.).     |
| Resume button missing                           | The PDF is not at `public/resume/Raj_Konde_Resume.pdf`.                         |
| Playwright says browser not found               | `npx playwright install chromium`.                                              |
| Sitemap shows `localhost`                       | `NEXT_PUBLIC_SITE_URL` not set at build time; set it and redeploy.              |
| Changes not visible on Vercel                   | Make sure you committed and pushed; Vercel deploys from GitHub.                 |

## 11. Honest limits

- Mail delivery verified only against a local fake server.
- Rate limiting is per server instance, in memory.
- Tested only in headless Chromium; not on real phones, Firefox, Safari, or
  with screen readers.
- GitHub Actions workflow and the live deployment have never been run.
- Mobile-home Lighthouse score varies by run (89–94).
- The CSP permits inline scripts/styles because Next.js needs them.
- Anything under "What is left for you" is genuinely unfinished.
