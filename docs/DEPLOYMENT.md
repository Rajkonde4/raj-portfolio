# Deployment

## Before you deploy

Run `npm run readiness`. Fix every BLOCKER; read each WARNING. Then run
`npm run check` and `npm run build` once locally. Use Node 22 (`.nvmrc`).

## Vercel (recommended)

1. Push the repository to GitHub.
2. Import it at vercel.com/new (framework preset: Next.js, no overrides).
3. Add environment variables (all optional):
   - `NEXT_PUBLIC_SITE_URL` = your production origin, e.g. `https://your-domain.com`
   - `NEXT_PUBLIC_CONTACT_EMAIL` = public contact address
   - To enable the contact form, all three of `RESEND_API_KEY`,
     `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (mark them Sensitive; never use a
     `NEXT_PUBLIC_` prefix). Without them the site shows contact links only.
4. Deploy. Set `NEXT_PUBLIC_SITE_URL` **before** the production build so that
   canonical URLs, Open Graph URLs and the sitemap use the real domain.

## Other hosts

Any Node host: `npm ci && npm run build && npm start` (Node 20.9+). The app
uses `proxy.ts` and Cache Components, so it needs a Node server rather than a
pure static export.

## Post-deploy checklist

- [ ] `/sitemap.xml` and `/robots.txt` show the production domain
- [ ] A published project URL loads; a bogus URL returns 404
- [ ] Resume button appears and the PDF downloads (once the PDF is added)
- [ ] If the form is enabled: send yourself a test message and confirm it
      arrives and that Reply goes to the sender
- [ ] Share the URL in a chat to confirm the Open Graph title and description
- [ ] Add the final domain to your GitHub and LinkedIn profiles

## Contact form notes

- Settings are read at request time: change them in Vercel and redeploy (or
  restart), no rebuild logic changes.
- The in-memory rate limiter is per server instance. For stronger limits add
  Vercel's firewall rate limiting for `/api/contact`.
- Use a verified sending domain in Resend for production. The shared
  `onboarding@resend.dev` sender only delivers to your own Resend account email.

## CI

`.github/workflows/ci.yml` runs lint, typecheck, format check, unit tests and
build on every push to `main` and every pull request, then the Playwright
suite. The workflow has not been run on GitHub yet.
