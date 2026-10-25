# Content Guide

Edit files, run `npm test`, preview with `npm run dev`. Nothing else needs to
change.

## Rules

- Add only facts you can verify. No invented metrics, certifications or roles.
- Skills are names only. No percentages.
- Use `TODO(Raj)` comments for facts you still have to confirm.
- Dates use `YYYY-MM` (for example `2026-05`); `end` may be `"present"`.
- `id` and `slug` values are lowercase-hyphenated.

## Files

| File                          | Controls                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/config/site.ts`          | Name, titles, description, roles, headline, summary, About text (`about.paragraphs`, `about.direction`), links, resume path |
| `src/config/navigation.ts`    | Which sections are enabled and their order                                                                                  |
| `src/content/projects.ts`     | Projects and case studies                                                                                                   |
| `src/content/experience.ts`   | Internship and leadership roles                                                                                             |
| `src/content/education.ts`    | Education                                                                                                                   |
| `src/content/skills.ts`       | Skill groups; empty groups are hidden                                                                                       |
| `src/content/achievements.ts` | Verified achievements/certifications (empty for now)                                                                        |

## Projects

Required: `slug`, `title`, `tagline`, `summary`, `category`, `status`,
`visibility`, `featured`, `tags`, `links`.

Optional case-study fields (rendered on `/projects/<slug>`):

- `problem`: a paragraph
- `architecture`: array of bullet strings
- `contribution`: what **you** built
- `features: { implemented: [...], planned: [...] }`: keep them separate and
  truthful
- `links.repository`, `links.demo`: http(s) URLs
- `preview: { src, alt }`: screenshot shown at the top of the case study
  (save the file under `public/images/projects/`)
- `pipeline`: ordered stages (`id`, `label`, `technology?`, `description`,
  `status`). The featured project's pipeline also drives the home-page spotlight

To publish a draft, change `visibility` to `"published"` and replace the
"Details to be added." placeholders first.

## Showing the email address

Set `NEXT_PUBLIC_CONTACT_EMAIL` in `.env.local` (and in your hosting
environment). It is public by nature.

## Resume

Save the PDF at `public/resume/Raj_Konde_Resume.pdf`.

## Outstanding content

Filled in from Raj's project notes and `public/resume/Raj_Konde_Resume.pdf`
(the Aug 2026 resume, which is the reference version). Still needed:

- `contribution` for all four projects (after checking each repository)
- Repository and demo links for all four projects
- AquaMind: the resume's "estimated" efficiency figures are deliberately not
  published; add them only with an explanation of how they were measured
- Regional Slang: supported languages and any evaluation results
- TEDxPCU mentor dates and responsibilities; Explore Germany dates
- EventSphere start month (resume gives only "2026 – Present")
- Certifications/roles not on the Aug resume but kept from other notes: Google
  Introduction to AI, Deutschfeast Media Team Lead, TEDxPCU mentor. Remove
  them if you want the site to match the resume exactly
- Project screenshots
- Project fields `features.inProgress` and `limitations` are available for
  honest status reporting; see GeoVision AI for an example
