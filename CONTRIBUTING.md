# Contributing

This is a personal portfolio, but the same workflow keeps it healthy.

1. Create a branch: `git switch -c feature/short-name`.
2. Make a small, focused change.
3. Run `npm run check` (lint, typecheck, format check, unit tests). For UI
   changes also run `npm run build && npm run test:e2e`.
4. Update `CHANGELOG.md` and any affected file in `docs/`.
5. Open a pull request. CI runs the same checks.

## Conventions

- Strict TypeScript. No `any` without a comment explaining why.
- Content lives in `src/config` and `src/content`, never inside components.
- Server components by default; add `"use client"` only for real interactivity.
- Do not add fabricated metrics, testimonials or achievements.
- Do not document or advertise a feature until it is implemented and tested.
- Never commit secrets. `.env.local` is git-ignored.
