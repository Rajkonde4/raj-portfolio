# Testing

## Unit (Vitest)

```bash
npm test            # run once
npm run test:watch  # watch mode
```

Files in `tests/unit/`:

- `content.test.ts`: every file in `src/config` and `src/content` validates
  against its Zod schema; ids/slugs are unique; schema rejects bad slugs,
  non-http links and malformed months.
- `particles.test.ts`: particle count, creation, movement and edge bounce,
  link fading, hex color parsing.
- `lib.test.ts`: draft filtering, featured ordering, empty skill groups hidden,
  section registry, SEO URL helpers.

## End-to-end (Playwright)

Runs against the production build with three helper processes started by
Playwright: a fake mail provider (port 4010), the site with mail settings
pointing at it (port 3100, desktop Chrome and a Pixel 7 profile), and the same
site without any mail settings (port 3101, project `unconfigured`).

```bash
npx playwright install chromium     # first time only
npm run build
npm run test:e2e
```

If a Chromium binary is already installed, skip the download:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chrome npm run test:e2e
```

Scenarios in `tests/e2e/site.spec.ts` (hero, navigation at both screen sizes,
background canvas, role rotation with and without reduced motion, no horizontal
scroll, resume download, sitemap and robots). Original list: hero and list render, skip link is the
first tab stop, project link opens its case study, draft/unknown slugs return
HTTP 404, sitemap excludes drafts, robots points to the sitemap.

## Static checks

```bash
npm run lint
npm run typecheck
npm run format:check
npm run check       # all of the above plus unit tests
```

## Not covered yet

Accessibility audit (axe), Lighthouse, visual regression, cross-browser
(only Chromium), and any future section or integration.

## Contact form coverage

- Unit: schema limits, rate limiter windows, handler order of checks (config,
  origin, size, rate limit, validation, send), and the form UI states.
- E2E (`tests/e2e/contact.spec.ts`): labelled fields, invisible honeypot, empty
  submit shows errors and sends nothing, valid message arrives at the fake
  provider with the right recipient/reply-to, provider failure keeps the text
  and shows no success, foreign origin is rejected, honeypot is rejected,
  newline in the name cannot inject headers.
- E2E (`contact-unconfigured.spec.ts`): no form and an honest message when mail
  is not configured, and the API answers 503.
- **Not covered:** delivery through the real Resend service.
