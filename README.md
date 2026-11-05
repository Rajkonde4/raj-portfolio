# Raj Konde — Full-Stack Developer & AI-Powered Applications Portfolio

A dark, editorial, content-driven portfolio for final-year placements, built
with Next.js (App Router), TypeScript and Tailwind CSS. All personal content
lives in typed files under `src/config` and `src/content`; components only
render data.

> **Status: Phases 1 (Foundation), 2 (Visual design) and 3 (Core portfolio) are
> complete.** The
> home page currently has a hero and a projects list, plus a case-study page per project. The remaining
> sections are planned. See [Known limitations](#18-known-limitations-and-future-enhancements)
> and [docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md).

## 1. Overview and goals

- Position the author as an AI/ML engineer (and aspiring Generative AI
  engineer) with solid software-engineering fundamentals.
- Keep content editable in one place, with no hardcoded text in components.
- Never invent achievements, metrics or experience: empty data renders
  nothing or an honest empty state.
- Stay maintainable by a single student developer.

## 2. Features

**Implemented and tested**

- Hero with name, headline, summary, and Resume / GitHub / LinkedIn actions
  (the Resume button only appears when the PDF exists).
- Home page sections driven by the registry in `src/config/navigation.ts`:
  Projects, GeoVision AI spotlight (per-stage status, limitations), About
  (with education), Skills, Experience timeline, Certifications.
- Projects list generated from `src/content/projects.ts` (four published projects).
- Case-study page per project at `/projects/[slug]` (problem, architecture,
  contribution, implemented / in-progress / planned features, current
  limitations, repo and demo links).
- Draft projects: hidden from the list, sitemap and static params, and
  served with a real HTTP 404.
- Section registry to enable, disable or reorder sections and navigation.
- Runtime validation of all content with Zod; a typo fails `npm test`.
- Metadata, Open Graph / Twitter tags, canonical URLs, `sitemap.xml`,
  `robots.txt`.
- Interactive particle-network background (canvas, pauses when the tab is
  hidden, static with reduced motion).
- Rotating role text and CSS entrance animations in the hero.
- Responsive navigation: inline links on desktop, accessible menu on mobile.
- Skip link, semantic landmarks, visible focus styles, reduced-motion support.
- Contact section with links, and a contact form that is shown only when a
  mail provider is configured (server-side validation, honeypot, origin check,
  rate limiting).
- Project filter by category, current-section highlight in the navigation,
  and scroll-driven reveals (CSS only).
- Error and not-found pages.

**Planned** (not built yet; see the roadmap)

the accessibility and performance audits (Phase 5) and deployment (Phase 6).

## 3. Technology stack

| Area       | Choice                                          | Why                                               |
| ---------- | ----------------------------------------------- | ------------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19               | Server components by default, static output, SEO  |
| Language   | TypeScript (strict)                             | Catches content and component mistakes early      |
| Styling    | Tailwind CSS 4, CSS variables for tokens        | Fast iteration, single design-token source        |
| Icons      | `lucide-react`                                  | Lightweight, consistent                           |
| Fonts      | Geist Sans/Mono, Instrument Serif (self-hosted) | No third-party font requests at build or runtime  |
| Validation | Zod 4                                           | Single schema source for types and runtime checks |
| Unit tests | Vitest                                          | Fast, TypeScript-native                           |
| E2E tests  | Playwright                                      | Real-browser checks on the production build       |
| Quality    | ESLint, Prettier (+ Tailwind plugin)            | Consistent code                                   |

`shadcn/ui` was in the brief but is deliberately **not** installed yet: no
component needs it, and unused dependencies cost maintenance. Add it when a
phase needs accessible primitives (for example a dialog or tabs).

## 4. Prerequisites

- Node.js **20.9 or newer** (developed and verified on Node 22).
- npm 10+.
- Git.

## 5–6. Install and run locally

```bash
git clone https://github.com/Rajkonde4/raj-portfolio.git   # after you create the repo
cd raj-portfolio
npm install
cp .env.example .env.local        # optional, every variable is optional
npm run dev                       # http://localhost:3000
```

## 7. Environment variables

Copy `.env.example` to `.env.local`. All variables are optional.

| Variable                      | Purpose                                                  |
| ----------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | Public origin for canonical URLs, Open Graph and sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL`   | Email shown on the site; leave empty to hide it          |
| `RESEND_API_KEY`              | Server-only. Resend API key (enables the contact form)   |
| `CONTACT_TO_EMAIL`            | Server-only. Inbox that receives messages                |
| `CONTACT_FROM_EMAIL`          | Server-only. Sender, e.g. `Portfolio <you@your-domain>`  |
| `CONTACT_RATE_LIMIT_PER_HOUR` | Optional. Messages per visitor per hour (default 5)      |

`NEXT_PUBLIC_*` values are embedded in client code and are public. Never put
secrets in them. `.env.local` is git-ignored. The three mail variables are
read on the server at request time, so changing them needs a restart (or a
redeploy on Vercel), not a rebuild.

## 8. Folder structure

```text
src/
  app/                 Routes, layout, metadata files (sitemap, robots), error/not-found
  proxy.ts             Returns real 404s for unknown/draft project slugs
  components/
    layout/            Header, footer
    sections/          Home-page sections (hero)
    projects/          Projects list and case-study page
    shared/            Container, section heading
  config/              site.ts (identity), navigation.ts (section registry), theme.ts (tokens for TS)
  content/             projects, experience, education, skills, achievements
  lib/                 content accessors, SEO helpers, resume check, utils, validations/
  types/               Types inferred from Zod schemas
  fonts/               Self-hosted Instrument Serif
public/
  resume/              Your resume PDF
  images/profile|projects/  Photos and screenshots
  icons/               Static icons / OG image
tests/
  unit/                Vitest
  e2e/                 Playwright
docs/                  Architecture, design system, guides, roadmap
```

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 9. Change your name, intro, links, skills, experience, education

- Identity, headline, summary, social links, resume path: `src/config/site.ts`
- Skills (names only, no percentages): `src/content/skills.ts` — empty groups
  are hidden
- Experience and leadership: `src/content/experience.ts`
- Education: `src/content/education.ts`
- Achievements and certifications: `src/content/achievements.ts`

Run `npm test` after editing; the schemas in
`src/lib/validations/content.ts` report mistakes. Full guide:
[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md). Items marked `TODO(Raj)` in
the content files need your real information.

## 10. Add a project (no component changes)

Append an object to the array in `src/content/projects.ts`:

```ts
{
  slug: "my-project",            // lowercase-hyphenated, becomes /projects/my-project
  title: "My Project",
  tagline: "One line.",
  summary: "Two or three sentences.",
  category: "ai-ml",             // ai-ml | computer-vision | nlp | full-stack | other
  status: "completed",           // completed | in-progress | prototype
  visibility: "published",       // "draft" hides it everywhere
  featured: false,
  tags: ["Python", "PyTorch"],
  links: { repository: "https://github.com/Rajkonde4/my-project" },
}
```

The list, case-study page and sitemap update automatically.

## 11. Resume and screenshots

- Resume: save as `public/resume/Raj_Konde_Resume.pdf` (or change
  `resume.path` in `src/config/site.ts`). The button appears automatically.
- Screenshots: save to `public/images/projects/<slug>.png` and set the
  project's `preview` field; the case-study page shows it at the top.

## 12. Styling, theme, typography, animation

- Colors and spacing tokens: CSS variables in `src/app/globals.css`; mirror
  any value needed in TypeScript in `src/config/theme.ts`.
- Fonts: configured in `src/app/layout.tsx`.
- Reduced motion is respected globally in `globals.css`.
- See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

## 13. GitHub API and analytics

**Deliberately not included.** The site has no GitHub activity feed and no
analytics. It loads no third-party scripts, sets no cookies and uses no browser
storage, and it makes no GitHub API calls, so there are no rate limits or
tokens to manage. Project cards link to repositories through
`links.repository` in `src/content/projects.ts`.

## 14. Contact form

Contact links (LinkedIn, GitHub, resume, and email if
`NEXT_PUBLIC_CONTACT_EMAIL` is set) always show. The form appears **only** when
`RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are all set;
otherwise the page says the form is not enabled, and `POST /api/contact`
answers 503. The site never shows a success message unless the mail provider
accepted the message.

Setup with [Resend](https://resend.com):

1. Create an API key and put it in `.env.local` as `RESEND_API_KEY`.
2. Set `CONTACT_TO_EMAIL` to your inbox.
3. Set `CONTACT_FROM_EMAIL`. For a quick test use
   `Portfolio <onboarding@resend.dev>`; Resend only delivers that sender's
   mail to your own account email. For real use, verify a domain in Resend.
4. Restart `npm run dev`.

Protections in `src/lib/contact-handler.ts`: same-origin check, 10 KB body
limit, per-visitor rate limit, Zod validation on the server (the browser
validates too, for speed), a hidden honeypot field, line breaks stripped from
the email subject, and no internal errors returned to the browser.

Limits to know about: the rate limiter keeps counts in memory, so on
serverless hosting each instance counts separately; it slows casual abuse but
is not a hard guarantee. The server trusts the first `x-forwarded-for` address,
which is correct behind Vercel but can be spoofed behind other proxies.
The code has been tested against a local fake mail server, **not** against the
real Resend service, so send yourself a test message after configuring it.

## 15. Quality commands

```bash
npm run lint           # ESLint
npm run typecheck      # next typegen + tsc --noEmit
npm run format:check   # Prettier (use `npm run format` to fix)
npm test               # Vitest unit tests
npm run check          # lint + typecheck + format:check + unit tests
npm run build          # production build
npm run test:e2e       # Playwright (run `npm run build` first)
```

First time running e2e: `npx playwright install chromium`. To reuse an
existing Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. See
[docs/TESTING.md](docs/TESTING.md).

## 16. GitHub and deployment

```bash
git init -b main && git add -A && git commit -m "Initial commit"
gh repo create Rajkonde4/raj-portfolio --public --source=. --push   # or create it on github.com
```

Deploy on Vercel by importing the repository and setting
`NEXT_PUBLIC_SITE_URL`. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 17. SEO, accessibility, performance, security

- SEO: per-page metadata, canonical URLs, Open Graph, sitemap, robots, real
  404 status for missing pages.
- Accessibility: skip link, landmarks, focus-visible, reduced motion. A full
  audit is planned (Phase 5); do not treat the site as audited yet.
- Performance: static prerendering, self-hosted fonts, no client-side JS in
  the current components. Not yet measured with Lighthouse.
- Security: no secrets in the repo, external links use
  `rel="noopener noreferrer"`, project link URLs are restricted to http(s) by
  the schema.

## 18. Known limitations and future enhancements

- Contact section and form are planned (Phase 4); contact today is via the
  GitHub and LinkedIn links.
- No project has a `contribution` text yet (to be written after checking each
  repository), and no project has repository or demo links.
- EventSphere has no start month because the resume gives only a year.
- Education appears inside About, not as a separate section.
- No project screenshots are committed, so `preview` images do not appear yet.
- No GitHub activity feed and no analytics, by design (see section 13).
- The background animation was measured only in headless Chromium; test it on
  a real low-end phone.
- The committed resume PDF contains a phone number and email; replace or
  remove it before making the repository public if you prefer.
- Lighthouse and accessibility audits have not been run.
