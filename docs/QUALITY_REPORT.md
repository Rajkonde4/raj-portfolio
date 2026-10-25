# Quality report

What was measured, with real results, and what was **not** measured.
Environment: headless Chromium from the sandbox, production
build served locally (`npm run build && npm start`). No real phone, Firefox or
Safari was available.

## Automated results

| Check                                  | Result                                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Unit tests (Vitest)                    | 68 passed                                                                                                        |
| End-to-end (Playwright)                | 92 passed, 4 skipped by design (desktop-only or mobile-only cases)                                               |
| axe-core (WCAG 2 A/AA + best practice) | 0 violations on home, both case studies, 404, open mobile menu, form errors, reduced motion                      |
| Lint / typecheck / Prettier            | clean                                                                                                            |
| `npm audit`                            | 0 vulnerabilities                                                                                                |
| Console                                | no errors, warnings or CSP violations on home and a case study                                                   |
| Links                                  | every in-page anchor has a target; internal links and resume PDF return 200; external links use `rel="noopener"` |

## Lighthouse (local production build)

| Page                  | Perf  | A11y | Best practices | SEO |
| --------------------- | ----- | ---- | -------------- | --- |
| Home, desktop         | 100   | 100  | 100            | 100 |
| Case study, desktop   | 100   | 100  | 100            | 100 |
| Case study, mobile    | 99    | 100  | 100            | 100 |
| Home, mobile (3 runs) | 89–94 | 100  | 100            | 100 |

The mobile home score is the one number that is not a clean pass. Lighthouse
simulates a slow phone, and in this sandbox the result moved between runs. In a
real browser the largest paint (the name heading) appeared at about 0.3 s. A
score measured on the deployed site from a real device is the number to trust;
run PageSpeed Insights after deploying.

## What was fixed along the way

- Unknown project URLs returned HTTP 200 (a "soft 404"); `src/proxy.ts` now
  forces a real 404.
- Project pages lost their social image; `buildPageMetadata` now sets it.
- The role text re-registered as a late, larger paint; the hero line and name
  are now rendered without an entrance animation and the role swaps in place.
- Resume button lost its focus outline because of `transition-all`; replaced by
  explicit transition properties.

## Security review

Present: same-origin check, 10 KB body limit, rate limit, Zod validation,
honeypot, 8 s upstream timeout, CSP, `X-Frame-Options: DENY`, `nosniff`,
Referrer-Policy, Permissions-Policy, HSTS, no `X-Powered-By`, secrets only
read on the server.

Known limits (be honest about these):

- The rate limiter is in memory, per server instance; add Vercel firewall rules
  for stronger protection.
- The client IP is read from `X-Forwarded-For`, which is trustworthy on Vercel
  but not on every host.
- CSP allows `'unsafe-inline'` scripts/styles because Next.js injects inline
  bootstrap scripts; a nonce-based CSP would need dynamic rendering for every page.
- Contact delivery has only been tested against a local fake mail server,
  never against real Resend.
- The resume PDF contains your phone number and email and is public once
  deployed. Remove them from the PDF if you do not want that.

## Not tested

Real devices, Firefox, Safari, screen readers (axe is automated and finds only
part of accessibility problems), slow real networks, the live Vercel
deployment, GitHub Actions (the workflow has never run).
